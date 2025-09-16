import { WebSocketServer } from 'ws';
import '../../globals';
import { _onError } from './_on-error';
import { _onMessage } from './_on-message';
import { _onServerClose, _onClientClose } from './_on-close';
import { _addNewUser } from './_add-new-user';
import { WebSocketMessage } from '@models';

export class GamesChannel {
	static initialize(hash: string): WebSocketServer {
		if (global.games[hash] === undefined) {
			throw new Error(`Game with hash ${hash} does not exist`);
		}

		global.games[hash].socketChannel.removeAllListeners();
		global.games[hash].socketChannel = new WebSocketServer({
			noServer: true,
			skipUTF8Validation: true,
		});

		global.games[hash].socketChannel.broadcast = _broadcast;

		global.games[hash].socketChannel.on('connection', (ws, req) => {
			const user = _addNewUser({ ws, req });

			ws.on('error', (error) =>
				_onError({ error, restart: () => GamesChannel.initialize(hash) }),
			);

			// ws.on('message', (text) => _onMessage({ user, text: text }));
			ws.on('message', (text) => _onMessage({ text: text }));

			// ws.on('close', () => _onClientClose({ user }));
			ws.on('close', () => _onClientClose({}));
		});

		global.games[hash].socketChannel.on('close', () =>
			_onServerClose({ restart: () => GamesChannel.initialize(hash) }),
		);

		global.games[hash].socketChannel.on('error', (error) =>
			_onError({ error, restart: () => GamesChannel.initialize(hash) }),
		);

		return global.games[hash].socketChannel;
	}
}

function _broadcast(message: WebSocketMessage) {
	global.games[message.from].socketChannel.clients.forEach((client) => {
		if (client.readyState === client.OPEN) {
			client.send(JSON.stringify(message));
		}
	});

	// const users = Object.values(global.users);
	// users.forEach((user) => {
	// 	user.client.send(JSON.stringify(message));
	// });
}
