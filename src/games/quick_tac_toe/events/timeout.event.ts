import { WebSocketMessage } from '@models';

export async function _timeout(hash: string, message: WebSocketMessage) {
	const game = global.games[hash];

	if (game === undefined) return;

	global.games[hash].status = 'finished';
	global.games[hash].updatedAt = new Date();
	global.games[hash].finishedAt = new Date();

	global.games[hash].socketChannel.broadcast?.({
		type: 'event',
		from: hash,
		to: hash,
		data: {
			event: 'timeout',
			timestamp: message.data?.timestamp || new Date().toISOString(),
		},
	});
}
