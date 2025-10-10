import { WebSocketMessage } from '@models';
import { checkDraw, checkWinner } from '../_utils';

export async function _move(hash: string, message: WebSocketMessage) {
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
		// Simple bot logic: choose a random available position
		const allPositions = ['a0', 'a1', 'a2', 'b0', 'b1', 'b2', 'c0', 'c1', 'c2'];
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

		const botMovePosition =
			availablePositions[Math.floor(Math.random() * availablePositions.length)];
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
}
