import { WebSocketMessage } from '@models';

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

	// check for win conditions
	const winner = _winningConditions.find((condition) =>
		condition.every((pos) =>
			global.games[hash].players[message.from].data.moves.includes(pos),
		),
	);

	if (winner) {
		// We have a winner
		const winMessage: WebSocketMessage = {
			type: 'event',
			from: hash,
			to: hash,
			data: {
				event: 'game_over',
				winner: message.from,
				winningPositions: winner,
			},
		};

		global.games[hash].socketChannel.broadcast?.(winMessage);
		global.games[hash].status = 'finished';
		global.games[hash].updatedAt = new Date();
		global.games[hash].finishedAt = new Date();
		return;
	}

	// Check for draw
	const totalMoves = Object.values(global.games[hash].players).reduce(
		(acc, p) => acc + (p.data.moves?.length || 0),
		0,
	);

	if (totalMoves >= 9) {
		// It's a draw
		const drawMessage: WebSocketMessage = {
			type: 'event',
			from: hash,
			to: hash,
			data: {
				event: 'game_over',
				winner: null,
			},
		};

		global.games[hash].socketChannel.broadcast?.(drawMessage);
		global.games[hash].status = 'finished';
		global.games[hash].updatedAt = new Date();
		global.games[hash].finishedAt = new Date();
		return;
	}

	// next turn
	if (!opponent) return;
	// global.games[hash].players[opponent.userId].client?.send(
	// 	JSON.stringify({
	// 		type: 'event',
	// 		from: hash,
	// 		to: opponent.userId,
	// 		data: {
	// 			event: 'your_turn',
	// 		},
	// 	}),
	// );
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
		}, 500);

		// setTimeout(() => {
		// 	global.games[hash].players[opponent.userId].client?.send(
		// 		JSON.stringify({
		// 			type: 'event',
		// 			from: hash,
		// 			to: opponent.userId,
		// 			data: {
		// 				event: 'your_turn',
		// 			},
		// 		}),
		// 	);
		// }, 1200);

		return;
	}
	// Object.values(global.games[hash].players)
	// 	.filter((p) => p.userId !== message.from)
	// 	.forEach((player) => {
	// 		global.games[hash].players[player.userId].client.send(
	// 			JSON.stringify({
	// 				type: 'event',
	// 				from: hash,
	// 				to: player.userId,
	// 				data: {
	// 					event: 'your_turn',
	// 				},
	// 			}),
	// 		);
	// 	});
}

const _winningConditions = [
	['a0', 'a1', 'a2'],
	['b0', 'b1', 'b2'],
	['c0', 'c1', 'c2'],
	['a0', 'b0', 'c0'],
	['a1', 'b1', 'c1'],
	['a2', 'b2', 'c2'],
	['a0', 'b1', 'c2'],
	['a2', 'b1', 'c0'],
];
