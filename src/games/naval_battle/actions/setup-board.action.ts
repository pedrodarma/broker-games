import { WebSocketMessage } from '@models';

export async function _setupBoard(hash: string, message: WebSocketMessage) {
	const game = global.games[hash];

	if (game === undefined || game.status !== 'waiting') return;

	if (message.from === undefined || message.data?.board === undefined) {
		return;
	}

	global.games[hash].players[message.from].data.board = message.data.board;

	const player = { ...global.games[hash].players[message.from] };
	delete player.client;

	const action: WebSocketMessage = {
		type: 'action',
		from: hash,
		to: message.from,
		data: {
			action: 'setupBoard',
			player: player.data,
		},
	};

	global.games[hash].players[message.from].client?.send?.(
		JSON.stringify(action),
	);
}
