import { WebSocketMessage } from '@models';
import { Actions } from './actions';
import { Events } from './events';

export const QuickTacToeGame = {
	handleMessage: _handleMessage,
};

async function _handleMessage(hash: string, message: WebSocketMessage) {
	const event = _getEvent(message);
	const action = _getAction(message);

	switch (message.type) {
		case 'event':
			// join, leave, start, end, etc.
			if (event === 'join') {
				await Events.join(hash, message);
				return;
			}
			if (event === 'timeout') {
				await Events.timeout(hash, message);
				return;
			}
			break;
		case 'action':
			if (action === 'move') {
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

function _getEvent(message: WebSocketMessage) {
	return typeof message.data?.event === 'string'
		? message.data.event.toLowerCase()
		: undefined;
}

function _getAction(message: WebSocketMessage) {
	return typeof message.data?.action === 'string'
		? message.data.action.toLowerCase()
		: undefined;
}

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
