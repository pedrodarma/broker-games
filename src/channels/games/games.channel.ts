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

		global.games[hash].socketChannel.broadcast = (message: WebSocketMessage) =>
			_broadcast(hash, message);

		global.games[hash].socketChannel.on('connection', (ws, req) => {
			const player = _addNewUser({ ws, req });

			if (player === undefined) {
				ws.close(999);
				return;
			}

			ws.on('error', (error) =>
				_onError({ error, restart: () => GamesChannel.initialize(hash) }),
			);

			ws.on('message', (text) => _onMessage({ hash, player, text: text }));

			ws.on('close', () => _onClientClose({ hash, player }));
		});

		global.games[hash].socketChannel.on('close', () =>
			_onServerClose({ hash, restart: () => GamesChannel.initialize(hash) }),
		);

		global.games[hash].socketChannel.on('error', (error) =>
			_onError({ error, restart: () => GamesChannel.initialize(hash) }),
		);

		return global.games[hash].socketChannel;
	}
}

function _broadcast(hash: string, message: WebSocketMessage) {
	global.games[hash]?.socketChannel?.clients?.forEach((client) => {
		if (client.readyState === client.OPEN) {
			client.send(JSON.stringify(message));
		}
	});
}
