import { WebSocketMessage } from '@models';

export function checkDraw(hash: string): boolean {
	// Check for draw
	const totalMoves = Object.values(global.games[hash].players).reduce(
		(acc, p) => acc + (p.data.moves?.length || 0),
		0,
	);

	if (totalMoves >= 9) {
		// It's a draw
		const drawMessage: WebSocketMessage = {
			type: 'event',
			from: hash,
			to: hash,
			data: {
				event: 'game_over',
				winner: null,
			},
		};

		global.games[hash].socketChannel.broadcast?.(drawMessage);
		global.games[hash].status = 'finished';
		global.games[hash].updatedAt = new Date();
		global.games[hash].finishedAt = new Date();
		return true;
	}

	return false;
}
