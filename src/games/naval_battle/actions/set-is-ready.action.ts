import { WebSocketMessage } from '@models';
import { getClearBoard } from '../_utils';

export async function _setIsReady(hash: string, message: WebSocketMessage) {
	const game = global.games[hash];

	if (game === undefined || game.status !== 'waiting') return;

	if (message.from === undefined || message.data?.isReady === undefined) {
		return;
	}

	global.games[hash].players[message.from].data.isReady = message.data.isReady;

	const player = { ...global.games[hash].players[message.from] };
	delete player.client;

	const action: WebSocketMessage = {
		type: 'action',
		from: message.from,
		to: hash,
		data: {
			action: 'setIsReady',
			player: { ...player.data, board: getClearBoard() },
		},
	};

	global.games[hash].socketChannel.broadcast?.(action);

	const bothReady = Object.values(global.games[hash].players).every(
		(p) => p.data.isReady,
	);
	if (bothReady) {
		// Start the game if both players are ready
		const startGame: WebSocketMessage = {
			type: 'event',
			from: hash,
			to: hash,
			data: {
				event: 'start',
				players: Object.values(global.games[hash].players).map((p) => {
					return { id: p.userId, team: p.data.team, color: p.data.color };
				}),
			},
		};

		global.games[hash].socketChannel.broadcast?.(startGame);
		global.games[hash].status = 'playing';
		global.games[hash].updatedAt = new Date();
		global.games[hash].startedAt = new Date();
	}
}
