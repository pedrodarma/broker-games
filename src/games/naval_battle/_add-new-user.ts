import { Player, WebSocketMessage } from '@models';
import { IncomingMessage } from 'http';
import { WebSocket } from 'ws';
import { Events } from './events';
import { getClearBoard } from './_utils';

interface Props {
	ws: WebSocket;
	req: IncomingMessage;
}

export function _addNewUser({ ws, req }: Props): Player | undefined {
	/**
	 * /games/:hash?player=playerId to play
	 * /games/:hash to watch
	 */
	const hash = req.url?.split('/game/')[1]?.split('?')[0];
	const params = req.url?.split('?')[1];

	const playerId = params?.split('user=')[1]?.split('&')[0];

	const isPlayer = playerId !== undefined && playerId.trim().length > 0;

	if (!hash || !playerId) {
		return undefined;
	}

	const game = global.games[hash];
	if (game && game.status === 'finished') {
		return undefined;
	}

	if (isPlayer) {
		const user = global.users[playerId];
		const player: Player | undefined = global.games[hash].players[playerId];

		global.games[hash].players[playerId] = {
			userId: user.id,
			client: ws,
			data: {
				team: undefined,
				color: undefined,
				isReady: false,
				board: getClearBoard(),
				targetBoard: getClearBoard(),
				...player?.data,
			},
		};

		const joinMessage: WebSocketMessage = {
			type: 'event',
			from: user.id,
			to: hash,
			data: {
				event: 'join',
			},
		};

		// QuickTacToeGame.handleMessage(hash, joinMessage);
		Events.join(hash, joinMessage);
	}

	return global.games[hash].players[playerId];
}
