import { WebSocketMessage } from '@models';

export const QuickTacToeGame = {
	// name: 'Quick Tac Toe',
	handleMessage: _handleMessage,
};

async function _handleMessage(hash: string, message: WebSocketMessage) {
	// Handle incoming messages from players
	switch (message.type) {
		case 'event':
			// join, leave, start, end, etc.
			break;
		case 'action':
			if (message.data.action === 'join') {
				// handled in _addNewUser

				const joinMessage: WebSocketMessage = {
					type: 'event',
					from: message.from,
					to: hash,
					data: {
						event: 'join',
						player: message.from,
						players: Object.keys(global.games[hash].players),
					},
				};

				global.games[hash].socketChannel.broadcast?.(joinMessage);

				const totalPlayers = Object.keys(global.games[hash].players).length;
				if (totalPlayers === global.games[hash].minPlayers) {
					const startGame: WebSocketMessage = {
						type: 'event',
						from: hash,
						to: hash,
						data: {
							event: 'start',
						},
					};

					setTimeout(() => {
						global.games[hash].socketChannel.broadcast?.(startGame);
						global.games[hash].status = 'playing';
						global.games[hash].updatedAt = new Date();
						global.games[hash].startedAt = new Date();

						// Notify the first player to make a move
						const firstPlayerId = Object.keys(global.games[hash].players)[0];
						const firstPlayer = global.games[hash].players[firstPlayerId];
						firstPlayer.client.send(
							JSON.stringify({
								type: 'event',
								from: hash,
								to: firstPlayerId,
								data: {
									event: 'your_turn',
								},
							}),
						);
					}, 1000);
					return;
				}
				return;
			}

			if (message.data.action === 'move') {
				if (
					message.from === undefined ||
					message.data?.position === undefined
				) {
					return;
				}

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

				global.games[hash].players[message.from].data.moves = [
					...global.games[hash].players[message.from].data.moves,
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
				Object.values(global.games[hash].players)
					.filter((p) => p.userId !== message.from)
					.forEach((player) => {
						player.client.send(
							JSON.stringify({
								type: 'event',
								from: hash,
								to: player.userId,
								data: {
									event: 'your_turn',
								},
							}),
						);
					});
			}
			break;

		default:
			// Unknown message type
			// eslint-disable-next-line no-console
			console.warn('Unknown message type:', { message });
			break;
	}
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

// async function _addPlayer(player) {
// 	// Add a player to the game
// }

// async function _removePlayer(player) {
// 	// Remove a player from the game
// }

// async function _removePlayer(player) {
// 	// Remove a player from the game
// }

/**
 * messages
 *
 * ```json
 * {
 *   "type": "action",
 *   "from": "playerId",
 *   "gameId": "gameId",
 *   "data": {
 *     "action": "makeMove",
 *     "position": "A1",
 *   }
 * }
 * ```
 */
