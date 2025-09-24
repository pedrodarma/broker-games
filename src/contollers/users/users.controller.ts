import { Request, Response } from 'express';

export class UsersController {
	static async get(req: Request, res: Response) {
		if (!req.params.userId && !req.query.userId && !req.body.userId) {
			return res.status(400).json({ error: 'Game ID is required' });
		}

		const userId = req.query.userId || req.params.userId || req.body.userId;

		const _users = Object.values(global.users);

		const user = _users
			.map((u) => {
				return {
					id: u.id,
					username: u.username,
					avatar: u.avatar,
					createdAt: u.createdAt,
					updatedAt: u.updatedAt,
				};
			})
			.find((u) => u.id === userId);

		return res.status(200).json(user);
	}

	static async list(req: Request, res: Response) {
		const _users = Object.values(global.users);

		const users = _users.map((user) => {
			return {
				id: user.id,
				username: user.username,
				avatar: user.avatar,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			};
		});

		return res.status(200).json(users);
	}
}
