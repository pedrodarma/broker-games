import { WebSocketMessage } from '@models';
import { getClearBoard } from '../_utils';

export async function _updateColor(hash: string, message: WebSocketMessage) {
	try {
		const game = global.games[hash];

		if (game === undefined || game.status !== 'waiting') return;

		if (message.from === undefined || message.data?.color === undefined) {
			return;
		}

		global.games[hash].players[message.from].data.color = message.data.color;

		const player = { ...global.games[hash].players[message.from] };
		delete player.client;

		const action: WebSocketMessage = {
			type: 'action',
			from: message.from,
			to: hash,
			data: {
				action: 'updateColor',
				player: { ...player.data, board: getClearBoard() },
			},
		};

		global.games[hash].socketChannel.broadcast?.(action);
	} catch (error) {
		console.error('Error in _updateColor:', error);
	}
}
