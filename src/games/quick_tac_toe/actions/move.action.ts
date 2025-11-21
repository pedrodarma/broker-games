import { WebSocketMessage } from '@models';
import { checkDraw, checkWinner } from '../_utils';
import { LogsChannel } from '../../../channels/logs/logs.channel';
import { PredictionService } from '@services';

export async function _move(hash: string, message: WebSocketMessage) {
	const game = global.games[hash];

	if (game === undefined || game.status !== 'playing') return;

	if (message.from === undefined || message.data?.position === undefined) {
		return;
	}

	const gameMode = global.games[hash].gameMode;
	const isAgainstBot = gameMode === 'local_bot';
	const isLocalPVP = gameMode === 'local_pvp';

	const player = global.games[hash].players[message.from];
	const opponent = Object.values(global.games[hash].players).find(
		(p) => p.userId !== message.from,
	);

	if (!opponent) return;

	if (player?.data.moves?.includes(message.data.position)) {
		// Invalid move: position already taken by the same player
		return;
	}

	if (opponent?.data.moves?.includes(message.data.position)) {
		// Invalid move: position already taken by the opponent
		return;
	}

	const currentMoves = player?.data?.moves || [];

	global.games[hash].players[message.from].data.moves = [
		...currentMoves,
		message.data.position,
	];

	const move: WebSocketMessage = {
		type: 'action',
		from: message.from,
		to: opponent?.userId,
		data: {
			action: 'move',
			position: message.data.position,
			symbol: player?.data.symbol,
		},
	};

	LogsChannel.sendLog(game.key, hash, 'move');
	global.games[hash].socketChannel.broadcast?.(move);

	if (checkWinner(hash, message)) return;

	if (checkDraw(hash)) return;

	global.games[hash].socketChannel.broadcast?.({
		type: 'event',
		from: hash,
		to: opponent.userId,
		data: {
			event: 'your_turn',
		},
	});

	if (isAgainstBot && !message.from.includes('bot_')) {
		await _moveBot(hash, message);
	}
}

const allPositions = ['a0', 'a1', 'a2', 'b0', 'b1', 'b2', 'c0', 'c1', 'c2'];
const boardMapping: { [key: string]: number } = {
	a0: 0,
	a1: 1,
	a2: 2,
	b0: 3,
	b1: 4,
	b2: 5,
	c0: 6,
	c1: 7,
	c2: 8,
};

export async function _moveBot(hash: string, message: WebSocketMessage) {
	const player = global.games[hash].players[message.from];
	const opponent = Object.values(global.games[hash].players).find(
		(p) => p.userId !== message.from,
	);

	if (!opponent) return;

	let botMovePosition: string;
	// Simple bot logic: choose a random available position
	const takenPositions = [
		...global.games[hash].players[message.from].data.moves,
		...(opponent.data.moves ?? []),
	];
	const availablePositions = allPositions.filter(
		(pos) => !takenPositions.includes(pos),
	);

	if (availablePositions.length === 0) {
		return;
	}

	if (availablePositions.length === 9) {
		// If it's the first move, choose a random position
		botMovePosition =
			availablePositions[Math.floor(Math.random() * availablePositions.length)];
	} else {
		try {
			const xMoves: string[] =
				global.games[hash].players[message.from].data.moves;
			const oMoves: string[] = opponent.data.moves ?? [];
			const _board = Array(9).fill(0);
			xMoves.forEach((pos: string) => {
				_board[boardMapping[pos]] = 1;
			});
			oMoves.forEach((pos: string) => {
				_board[boardMapping[pos]] = -1;
			});

			const lastMove = xMoves[xMoves.length - 1] ?? -1;

			const move = await PredictionService.fetch({
				game: 'QTT',
				board: _board,
				player: opponent.data.symbol === 'X' ? 1 : -1,
				lastMove: boardMapping[lastMove] ?? -1,
			});
			botMovePosition = allPositions[move];
		} catch {
			botMovePosition =
				availablePositions[
					Math.floor(Math.random() * availablePositions.length)
				];
		}
	}

	setTimeout(() => {
		_move(hash, {
			type: 'action',
			from: opponent.userId,
			to: message.from,
			data: {
				action: 'move',
				position: botMovePosition,
			},
		});
	}, 300);
}
