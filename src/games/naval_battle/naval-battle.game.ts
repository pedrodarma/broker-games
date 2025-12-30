import { WebSocketMessage } from '@models';
import { Actions } from './actions';
import { Events } from './events';
import { _addNewUser } from './_add-new-user';

export const NavalBattleGame = {
	handleMessage: _handleMessage,
	addNewUser: _addNewUser,
};

async function _handleMessage(hash: string, message: WebSocketMessage) {
	// console.log('NavalBattleGame handleMessage', { hash, message });
	const event = _getEvent(message);
	const action = _getAction(message);

	// console.log({ event, action });
	// console.log({ message });

	switch (message.type) {
		case 'event':
			// join, leave, start, end, etc.
			if (event === 'join') {
				await Events.join(hash, message);
				return;
			}
			if (event === 'ready') {
				await Events.ready(hash, message);
				return;
			}
			// if (event === 'timeout') {
			// 	await Events.timeout(hash, message);
			// 	return;
			// }
			break;
		case 'action':
			if (action === 'updateteam') {
				await Actions.updateTeam(hash, message);
				return;
			}
			if (action === 'updatecolor') {
				await Actions.updateColor(hash, message);
				return;
			}
			if (action === 'setupboard') {
				await Actions.setupBoard(hash, message);
				return;
			}
			if (action === 'setisready') {
				await Actions.setIsReady(hash, message);
				return;
			}
			if (action === 'attack') {
				await Actions.attack(hash, message);
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
