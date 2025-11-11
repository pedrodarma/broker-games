import '../../globals';
import { Server } from '@models';

interface ServerCloseProps {
	restart: () => void;
}

export function _onServerClose({ restart }: ServerCloseProps) {
	global.globalChatChannel.close();

	setTimeout(() => {
		restart();
	}, 3000);
}

interface ClientCloseProps {
	server: Server;
}

export function _onClientClose({ server }: ClientCloseProps) {
	server.client.close();
	// // eslint-disable-next-line no-console
	// console.log(`User ${user.id} disconnected`);
	// // eslint-disable-next-line no-console
	// console.log(`User ${user.id} closed`);
	// // eslint-disable-next-line no-console
	// console.log('====================================');

	delete global.users[server.id];

	setTimeout(() => {
		global.globalChatChannel.broadcast?.({
			type: 'event',
			from: server.id,
			data: {
				event: 'server_disconnected',
			},
		});
	}, 1000);
}
