import { QuickTacToeGame } from '@games';
import { Player, WebSocketMessage } from '@models';
import { IncomingMessage } from 'http';
import { WebSocket } from 'ws';

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

	const isPlayer = playerId !== undefined;

	if (!hash || !playerId) {
		return undefined;
	}

	const game = global.games[hash];
	if (game && game.status === 'finished') {
		return undefined;
	}

	if (isPlayer) {
		const user = global.users[playerId];
		const isFirstPlayer = Object.keys(global.games[hash].players).length === 0;
		const symbol = isFirstPlayer
			? global.games[hash].players[playerId]?.data?.symbol ?? 'O'
			: global.games[hash].players[playerId]?.data?.symbol ?? 'X';
		global.games[hash].players[playerId] = {
			userId: user.id,
			client: ws,
			data: {
				symbol: symbol,
				moves: [],
			},
		};

		const joinMessage: WebSocketMessage = {
			type: 'event',
			from: user.id,
			to: hash,
			data: {
				event: 'join',
				player: user.id,
				players: Object.keys(global.games[hash].players),
			},
		};

		QuickTacToeGame.handleMessage(hash, joinMessage);
	}

	return global.games[hash].players[playerId];
}
