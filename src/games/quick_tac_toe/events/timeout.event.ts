import { WebSocketMessage } from '@models';
import { LogsChannel } from '../../../channels/logs/logs.channel';

export async function _timeout(hash: string, message: WebSocketMessage) {
	const game = global.games[hash];

	if (game === undefined) return;

	global.games[hash].status = 'finished';
	global.games[hash].updatedAt = new Date();
	global.games[hash].finishedAt = new Date();

	LogsChannel.sendLog(game.key, hash, 'game_over_timeout');
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
