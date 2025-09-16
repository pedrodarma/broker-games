import { Request, Response } from 'express';
import { games } from '@constants';

export class GamesController {
	static async list(req: Request, res: Response) {
		try {
			const _games = Object.values(games);
			const _keys = Object.keys(games);

			return res.status(200).json(
				_games.map((game, index) => ({
					id: _keys[index],
					name: game.name,
					maxPlayers: game.maxPlayers,
					minPlayers: game.minPlayers,
				})),
			);
		} catch (error) {
			return res.status(500).json({ error: 'Internal server error' });
		}
	}

	static async listLive(req: Request, res: Response) {
		try {
			const _games = Object.values(global.games);

			return res.status(200).json(
				_games.map((game) => ({
					id: game.id,
					name: game.name,
					createdAt: game.createdAt,
					updatedAt: game.updatedAt,
					status: game.status,
					currentPlayers: Object.keys(game.players).length,
					watchers: game.watchers.length,
					maxPlayers: game.maxPlayers,
					minPlayers: game.minPlayers,
				})),
			);
		} catch (error) {
			return res.status(500).json({ error: 'Internal server error' });
		}
	}
}
