import { Player, WebSocketMessage } from '@models';
import { IncomingMessage } from 'http';
import { WebSocket } from 'ws';
import { Events } from './events';

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
		const symbol = _getSymbol(hash, playerId);

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

		// QuickTacToeGame.handleMessage(hash, joinMessage);
		Events.join(hash, joinMessage);
	}

	return global.games[hash].players[playerId];
}

type Symbols = 'X' | 'O';

function _getSymbol(hash: string, playerId: string): Symbols {
	const game = global.games[hash];
	if (!game) {
		throw new Error('Game not found');
	}

	const symbols: Symbols[] = ['X', 'O'];
	const currentSymbol = game.players[playerId]?.data?.symbol;

	if (currentSymbol && symbols.includes(currentSymbol)) {
		return currentSymbol;
	}

	const isFirstPlayer = Object.keys(game.players).length === 0;
	if (!isFirstPlayer) {
		const firstPlayerSymbol = Object.values(game.players)[0]?.data?.symbol;
		return firstPlayerSymbol === 'X' ? 'O' : 'X';
	}

	const randomIndex = Math.floor(Math.random() * symbols.length);
	const symbol = symbols[randomIndex];
	return symbol;
}
