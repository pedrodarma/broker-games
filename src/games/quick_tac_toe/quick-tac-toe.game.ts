import { WebSocketMessage } from '@models';
import { Actions } from './actions';
import { Events } from './events';

export const QuickTacToeGame = {
	// name: 'Quick Tac Toe',
	handleMessage: _handleMessage,
};

async function _handleMessage(hash: string, message: WebSocketMessage) {
	// Handle incoming messages from players
	switch (message.type) {
		case 'event':
			// join, leave, start, end, etc.
			if (message.data.event === 'join') {
				await Events.join(hash, message);
				return;
			}
			break;
		case 'action':
			if (message.data.action === 'move') {
				await Actions.move(hash, message);
				return;
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
