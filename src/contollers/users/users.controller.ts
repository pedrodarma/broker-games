import { Request, Response } from 'express';

export class UsersController {
	static async get(req: Request, res: Response) {
		const _users = Object.values(global.users);

		const user = _users
			.map((user) => {
				return {
					id: user.id,
					name: user.username,
					avatar: user.avatar,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
				};
			})
			.find((u) => u.id === req.params.userId);

		return res.status(200).json(user);
	}

	static async list(req: Request, res: Response) {
		const _users = Object.values(global.users);

		const users = _users.map((user) => {
			return {
				id: user.id,
				name: user.username,
				avatar: user.avatar,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			};
		});

		return res.status(200).json(users);
	}
}
