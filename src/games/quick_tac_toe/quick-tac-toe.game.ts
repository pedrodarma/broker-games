import { WebSocketMessage } from '@models';

const QuickTacToeGame = {
	// name: 'Quick Tac Toe',
};

async function _handleMessage(message: WebSocketMessage) {
	// Handle incoming messages from players
	switch (message.type) {
		case 'action':
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
