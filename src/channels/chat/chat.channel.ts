import { WebSocketServer } from 'ws';
import '../../globals';
import { _onError } from './_on-error';
import { _onMessage } from './_on-message';
import { _onServerClose, _onClientClose } from './_on-close';
import { _addNewUser } from './_add-new-user';
import { WebSocketMessage } from '../../models';

export class ChatChannel {
	static initialize(): WebSocketServer {
		global.globalChatChannel.removeAllListeners();
		global.globalChatChannel = new WebSocketServer({
			noServer: true,
			skipUTF8Validation: true,
		});

		global.globalChatChannel.broadcast = _broadcast;

		global.globalChatChannel.on('connection', (ws, req) => {
			const user = _addNewUser({ ws, req });

			setTimeout(() => {
				global.globalChatChannel.broadcast
					? global.globalChatChannel.broadcast({
							type: 'event',
							from: user.id,
							data: {
								event: 'new_user',
							},
					  })
					: undefined;
			}, 1000);

			ws.on('error', (error) =>
				_onError({ error, restart: ChatChannel.initialize }),
			);

			ws.on('message', (text) => _onMessage({ user, text: text }));

			ws.on('close', () => _onClientClose({ user }));
		});

		global.globalChatChannel.on('close', () =>
			_onServerClose({ restart: ChatChannel.initialize }),
		);

		global.globalChatChannel.on('error', (error) =>
			_onError({ error, restart: ChatChannel.initialize }),
		);

		return global.globalChatChannel;
	}
}

function _broadcast(message: WebSocketMessage) {
	global.globalChatChannel.clients.forEach((client) => {
		if (client.readyState === client.OPEN) {
			client.send(JSON.stringify(message));
		}
	});
	// const users = Object.values(global.users);
	// users.forEach((user) => {
	// 	user.client.send(JSON.stringify(message));
	// });
}
