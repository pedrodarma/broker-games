import { IncomingMessage } from 'http';
import { WebSocket } from 'ws';
import { User } from '@models';
import { IDUtils } from '@utils';

interface Props {
	ws: WebSocket;
	req: IncomingMessage;
}

export function _addNewUser({ ws, req }: Props): User {
	const id = IDUtils.generate();

	const user: User = {
		id,
		username: `user-${id.slice(0, 5)}`,
		client: ws,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	global.users[user.id] = user;

	ws.send(JSON.stringify({ type: 'registered', data: { id: user.id } }));

	return user;
}
