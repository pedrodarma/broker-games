import { WebSocketMessage } from '@models';
import { getClearBoard } from '../_utils';
import { _attackBot } from './attack.action';

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
	if (Object.values(global.games[hash].players).length === 2 && bothReady) {
		setTimeout(() => {
			// Start the game if both players are ready
			const startGame: WebSocketMessage = {
				type: 'event',
				from: hash,
				to: hash,
				data: {
					event: 'start',
					players: Object.values(global.games[hash].players).map((p) => {
						return { userId: p.userId, team: p.data.team, color: p.data.color };
					}),
				},
			};

			global.games[hash].socketChannel.broadcast?.(startGame);
			global.games[hash].status = 'playing';
			global.games[hash].updatedAt = new Date();
			global.games[hash].startedAt = new Date();

			setTimeout(() => {
				const playerToStart = Object.values(global.games[hash].players)[
					Math.floor(
						Math.random() * Object.values(global.games[hash].players).length,
					)
				];
				const opponent = Object.values(global.games[hash].players).find(
					(p) => p.userId !== playerToStart.userId,
				);

				const yourTurnMessage: WebSocketMessage = {
					type: 'event',
					from: hash,
					to: playerToStart.userId,
					data: {
						event: 'your_turn',
					},
				};

				global.games[hash].socketChannel.broadcast?.(yourTurnMessage);

				if (playerToStart.data.isBot) {
					setTimeout(async () => {
						await _attackBot(hash, {
							type: 'action',
							from: opponent!.userId,
							to: playerToStart.userId,
							data: {
								action: 'attack',
							},
						});
					}, 3500);
				}
			}, 2500);
		}, 3500);
	}
}
