import { IncomingMessage } from 'http';
import { WebSocket } from 'ws';
// import { User } from '../../models';
// import { IDUtils, IPUtils } from '../../utils';

interface Props {
	ws: WebSocket;
	req: IncomingMessage;
}

export function _addNewUser({ ws, req }: Props): string {
	/**
	 * /games/:hash?player=playerId to play
	 * /games/:hash to watch
	 */
	const hash = req.url?.split('/game/')[1]?.split('?')[0];
	const params = req.url?.split('?')[1];

	const playerId = params?.split('player=')[1]?.split('&')[0];

	const isPlayer = playerId !== undefined;

	if (hash) {
		if (isPlayer) {
			const user = global.users[playerId];
			// const game = global.games[hash].players.length;
			global.games[hash].players[playerId] = {
				userId: user.id,
				client: ws,
				data: {
					// ...global.games[hash].players[playerId].data,
				},
			};
		}
	}
	// const ip = IPUtils.getIP(req);

	// const user: User = {
	// 	id: IDUtils.generate(),
	// 	ip: ip,
	// 	client: ws,
	// 	createdAt: new Date(),
	// 	updatedAt: new Date(),
	// };

	// global.users[user.id] = user;

	// ws.send(JSON.stringify({ type: 'registered', data: { id: user.id } }));

	return 'user';
}
