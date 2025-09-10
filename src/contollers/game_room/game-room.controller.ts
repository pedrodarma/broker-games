import { Request, Response } from 'express';
import { IDUtils } from '@utils';
import { games } from '@constants';
import { WebSocketServer } from 'ws';
import { GamesChannel } from '@channels';

export class GameRoomController {
	static async create(req: Request, res: Response) {
		const hash = IDUtils.generate();

		if (!req.params.gameId) {
			return res.status(400).json({ error: 'Game ID is required' });
		}

		const id = Number(req.params.gameId);

		const game = games[id];

		global.games[hash] = {
			...game,
			id,
			hash: hash,
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

		global.games[hash].socketChannel = GamesChannel.initialize(hash);

		return res.status(200).json({ id: hash });
	}
}
