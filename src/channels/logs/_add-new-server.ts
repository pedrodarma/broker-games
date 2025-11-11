import { IncomingMessage } from 'http';
import { WebSocket } from 'ws';
import { Server } from '@models';
import { IDUtils } from '@utils';

interface Props {
	ws: WebSocket;
	req: IncomingMessage;
}

export function _addNewServer({ ws, req }: Props): Server {
	const serverId = req.url?.split('server=')[1]?.split('&')[0];
	const id = serverId ?? IDUtils.generate();

	const server: Server = {
		id,
		client: ws,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	ws.send(JSON.stringify({ type: 'registered', data: { id: server.id } }));

	return server;
}
