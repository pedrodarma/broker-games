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
		} catch {
			return res.status(500).json({ error: 'Internal server error' });
		}
	}

	static async listLive(req: Request, res: Response) {
		try {
			const _games = Object.values(global.games);

			return res.status(200).json(
				_games.map((game) => ({
					id: game.id,
					hash: game.hash,
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
		} catch {
			return res.status(500).json({ error: 'Internal server error' });
		}
	}

	static async get(req: Request, res: Response) {
		if (!req.params.gameId && !req.query.gameId && !req.body.gameId) {
			return res.status(400).json({ error: 'Game ID is required' });
		}

		const gameId = req.query.gameId || req.params.gameId || req.body.gameId;

		const game = global.games[gameId];

		if (!game) {
			return res.status(404).json({ error: 'Game not found' });
		}

		return res.status(200).json({
			id: game.id,
			hash: game.hash,
			name: game.name,
			createdAt: game.createdAt,
			updatedAt: game.updatedAt,
			status: game.status,
			currentPlayers: Object.keys(game.players),
			watchers: game.watchers,
			maxPlayers: game.maxPlayers,
			minPlayers: game.minPlayers,
		});
		// return res.status(200).json({ message: 'Get game by ID' });
	}
}
