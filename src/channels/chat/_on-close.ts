import '../../globals';
import { User } from '@models';

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
	user: User;
}

export function _onClientClose({ user }: ClientCloseProps) {
	user.client.close();
	// // eslint-disable-next-line no-console
	// console.log(`User ${user.id} disconnected`);
	// // eslint-disable-next-line no-console
	// console.log(`User ${user.id} closed`);
	// // eslint-disable-next-line no-console
	// console.log('====================================');

	delete global.users[user.id];

	setTimeout(() => {
		global.globalChatChannel.broadcast
			? global.globalChatChannel.broadcast({
					type: 'event',
					from: user.id,
					data: {
						event: 'user_disconnected',
					},
			  })
			: undefined;
	}, 1000);
}
