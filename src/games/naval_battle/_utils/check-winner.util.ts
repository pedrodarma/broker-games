import { WebSocketMessage } from '@models';
import { LogsChannel } from '../../../channels/logs/logs.channel';
import { getTotalShipsCells } from './get-total-ships-cells.util';

export function checkWinner(hash: string, message: WebSocketMessage): boolean {
	const opponent = Object.values(global.games[hash].players).find(
		(p) => p.userId !== message.from,
	);

	const opponentTargetBoard = opponent?.data.targetBoard as Record<
		string,
		string[]
	>;

	let totalHits = 0;
	for (const row of Object.values(opponentTargetBoard || {})) {
		for (const cell of row) {
			if (cell === 'x') {
				totalHits++;
			}
		}
	}

	if (totalHits >= getTotalShipsCells()) {
		const winMessage: WebSocketMessage = {
			type: 'event',
			from: hash,
			to: hash,
			data: {
				event: 'game_over',
				winner: message.from,
			},
		};

		global.games[hash].socketChannel.broadcast?.(winMessage);
		global.games[hash].status = 'finished';
		global.games[hash].winner = message.from;
		global.games[hash].updatedAt = new Date();
		global.games[hash].finishedAt = new Date();

		// LogsChannel.sendLog(global.games[hash].key, hash, 'game_over_win');
		return true;
	}

	return false;
}
