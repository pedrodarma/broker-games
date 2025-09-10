import { IncomingMessage } from 'http';
import { WebSocket } from 'ws';
// import { User } from '../../models';
// import { IDUtils, IPUtils } from '../../utils';

interface Props {
	ws: WebSocket;
	req: IncomingMessage;
}

export function _addNewUser({ ws, req }: Props): string {
	// const ip = IPUtils.getIP(req);

	// const user: User = {
	// 	id: IDUtils.generate(),
	// 	ip: ip,
	// 	client: ws,
	// 	createdAt: new Date(),
	// 	updatedAt: new Date(),
	// };

	// global.users[user.id] = user;

	// ws.send(JSON.stringify({ type: 'registered', data: { id: user.id } }));

	return 'user';
}
