import { Request, Response } from 'express';
import { IDUtils } from '@utils';
import { games } from '@constants';
import { WebSocketServer } from 'ws';
import { GamesChannel } from '@channels';

export class GameRoomController {
	static async get(req: Request, res: Response) {
		try {
			const hash = req.params.hash || req.query.hash || req.body.hash;

			if (!hash || typeof hash !== 'string') {
				return res
					.status(400)
					.json({ error: 'Invalid or missing game room hash' });
			}

			const gameRoom = global.games[hash];

			if (!gameRoom) {
				return res.status(404).json({ error: 'Game room not found' });
			}

			return res.status(200).json(gameRoom);
		} catch {
			return res.status(500).json({ error: 'Internal server error' });
		}
	}

	static async create(req: Request, res: Response) {
		try {
			if (!req.params.gameId && !req.query.gameId && !req.body.gameId) {
				return res.status(400).json({ error: 'Game ID is required' });
			}

			const gameId = req.query.gameId || req.params.gameId || req.body.gameId;
			const gameKey = String(gameId) as keyof typeof games;
			const gameMode =
				req.query.gameMode ||
				req.params.gameMode ||
				req.body.gameMode ||
				'online';

			const isAgainstBot = gameMode === 'local_bot';
			const isLocalPVP = gameMode === 'local_pvp';
			const isOnline = gameMode === 'online';

			const game = games[gameKey];
			// const id = Number(gameId);

			// check if already has an active game with the same gameId and gameMode
			const existingGame = Object.values(global.games).find(
				(g) =>
					g.id === gameId && g.gameMode === gameMode && g.status === 'waiting',
			);

			if (existingGame) {
				return res.status(200).json({ id: existingGame.hash });
			}

			const _hash = IDUtils.generateShortID();

			const prefix = isAgainstBot ? 'bot_' : isLocalPVP ? 'pvp_' : '';

			const hash = `${prefix}${_hash}`;

			global.games[hash] = {
				...game,
				key: gameKey,
				id: gameId,
				hash: hash,
				gameMode: gameMode,
				players: {},
				watchers: [],
				status: 'waiting',
				socketChannel: new WebSocketServer({
					noServer: true,
					skipUTF8Validation: true,
				}),
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			GamesChannel.initialize(hash);

			return res.status(200).json({ id: hash });
		} catch {
			return res.status(500).json({ error: 'Internal server error' });
		}
	}
}
