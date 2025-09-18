import { WebSocketMessage } from '@models';

export const QuickTacToeGame = {
	// name: 'Quick Tac Toe',
	handleMessage: _handleMessage,
};

async function _handleMessage(hash: string, message: WebSocketMessage) {
	// Handle incoming messages from players
	switch (message.type) {
		case 'action':
			if (message.data.action === 'move') {
				// Process the move action
				// e.g., update game state, check for win conditions, etc.
				// Then broadcast the updated state to all players
				global.games[hash].socketChannel.broadcast?.(message);

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
