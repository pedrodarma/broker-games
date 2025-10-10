import { WebSocketMessage } from '@models';

export function checkWinner(hash: string, message: WebSocketMessage): boolean {
	// check for win conditions
	const winner = _winningConditions.find((condition) =>
		condition.every((pos) =>
			global.games[hash].players[message.from].data.moves.includes(pos),
		),
	);

	if (winner) {
		// We have a winner
		const winMessage: WebSocketMessage = {
			type: 'event',
			from: hash,
			to: hash,
			data: {
				event: 'game_over',
				winner: message.from,
				winningPositions: winner,
			},
		};

		global.games[hash].socketChannel.broadcast?.(winMessage);
		global.games[hash].status = 'finished';
		global.games[hash].updatedAt = new Date();
		global.games[hash].finishedAt = new Date();
		return true;
	}

	return false;
}

const _winningConditions = [
	['a0', 'a1', 'a2'],
	['b0', 'b1', 'b2'],
	['c0', 'c1', 'c2'],
	['a0', 'b0', 'c0'],
	['a1', 'b1', 'c1'],
	['a2', 'b2', 'c2'],
	['a0', 'b1', 'c2'],
	['a2', 'b1', 'c0'],
];
