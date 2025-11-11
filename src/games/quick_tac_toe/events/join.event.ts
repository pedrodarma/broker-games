import { WebSocketMessage } from '@models';

export async function _join(hash: string, message: WebSocketMessage) {
	const game = global.games[hash];

	if (game === undefined || game.status !== 'waiting') return;

	const gameMode = global.games[hash].gameMode;
	const isAgainstBot = gameMode === 'local_bot';
	const isLocalPVP = gameMode === 'local_pvp';

	const player = global.games[hash].players[message.from];

	const joinMessage: WebSocketMessage = {
		type: 'event',
		from: message.from,
		to: hash,
		data: {
			event: 'join',
			player: message.from,
			symbol: player.data.symbol,
			players: Object.keys(global.games[hash].players),
		},
	};

	global.games[hash].socketChannel.broadcast?.(joinMessage);

	if (isAgainstBot) {
		await _createBotPlayer(hash);
	}

	if (isLocalPVP) {
		await _createPlayer2(hash);
	}

	const totalPlayers = Object.keys(global.games[hash].players).length;
	if (totalPlayers === global.games[hash].minPlayers) {
		const startGame: WebSocketMessage = {
			type: 'event',
			from: hash,
			to: hash,
			data: {
				event: 'start',
				players: Object.values(global.games[hash].players).map((p) => {
					return { id: p.userId, symbol: p.data.symbol };
				}),
			},
		};

		global.games[hash].socketChannel.broadcast?.(startGame);
		global.games[hash].status = 'playing';
		global.games[hash].updatedAt = new Date();
		global.games[hash].startedAt = new Date();

		// Notify the first player to make a move
		const firstPlayerId = Object.keys(global.games[hash].players)[0];
		const firstPlayer = global.games[hash].players[firstPlayerId];

		global.games[hash].socketChannel.broadcast?.({
			type: 'event',
			from: hash,
			to: firstPlayerId,
			data: {
				event: 'your_turn',
			},
		});

		return;
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
			symbol: 'O',
			isBot: true,
		},
	};

	const joinMessage: WebSocketMessage = {
		type: 'event',
		from: botId,
		to: hash,
		data: {
			event: 'join',
			player: botId,
			symbol: 'O',
			players: Object.keys(global.games[hash].players),
		},
	};

	global.games[hash].socketChannel.broadcast?.(joinMessage);
}

async function _createPlayer2(hash: string) {
	const player1 = Object.values(global.games[hash].players)[0];

	const player2Id = `p2_${player1.userId}`;
	global.games[hash].players[player2Id] = {
		userId: player2Id,
		client: player1.client,
		data: {
			symbol: 'O',
		},
	};

	const joinMessage: WebSocketMessage = {
		type: 'event',
		from: player2Id,
		to: hash,
		data: {
			event: 'join',
			player: player2Id,
			symbol: 'O',
			players: Object.keys(global.games[hash].players),
		},
	};

	global.games[hash].socketChannel.broadcast?.(joinMessage);
}
