import { WebSocketMessage } from '@models';
import {
	getClearBoard,
	getRandomBoard,
	getRandomColor,
	getRandomTeam,
} from '../_utils';

export async function _join(hash: string, message: WebSocketMessage) {
	const game = global.games[hash];

	if (game === undefined || game.status !== 'waiting') return;

	const gameMode = global.games[hash].gameMode;
	const isAgainstBot = gameMode === 'local_bot';
	const isLocalPVP = gameMode === 'local_pvp';

	const player = { ...global.games[hash].players[message.from] };
	delete player.client;

	const joinMessage: WebSocketMessage = {
		type: 'event',
		from: message.from,
		to: hash,
		data: {
			event: 'join',
			player: { ...player.data, board: getClearBoard() },
		},
	};

	global.games[hash].socketChannel.broadcast?.(joinMessage);

	if (isAgainstBot) {
		await _createBotPlayer(hash);
	}

	return;
}

async function _createBotPlayer(hash: string) {
	const player = Object.values(global.games[hash].players)[0];

	const botId = `bot_${player.userId}`;
	global.games[hash].players[botId] = {
		userId: botId,
		client: player.client,
		data: {
			team: getRandomTeam(),
			color: getRandomColor(),
			isReady: true,
			board: getRandomBoard(),
			targetBoard: getClearBoard(),
			isBot: true,
		},
	};

	const joinMessage: WebSocketMessage = {
		type: 'event',
		from: botId,
		to: hash,
		data: {
			event: 'join',
			player: global.games[hash].players[botId].data,
		},
	};

	global.games[hash].socketChannel.broadcast?.(joinMessage);
}

async function _createPlayer2(hash: string) {
	const player1 = Object.values(global.games[hash].players)[0];

	// const symbol = player1.data.symbol === 'X' ? 'O' : 'X';

	const player2Id = `p2_${player1.userId}`;
	global.games[hash].players[player2Id] = {
		userId: player2Id,
		client: player1.client,
		data: {
			team: undefined,
			color: undefined,
			isReady: true,
			board: [],
			targetBoard: getClearBoard(),
		},
	};

	const joinMessage: WebSocketMessage = {
		type: 'event',
		from: player2Id,
		to: hash,
		data: {
			event: 'join',
			player: player2Id,
			// symbol: symbol,
			players: Object.keys(global.games[hash].players),
		},
	};

	global.games[hash].socketChannel.broadcast?.(joinMessage);
}
