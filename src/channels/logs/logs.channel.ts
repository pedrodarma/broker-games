import { WebSocketServer } from 'ws';
import '../../globals';
import { _onError } from './_on-error';
import { _onMessage } from './_on-message';
import { _onServerClose, _onClientClose } from './_on-close';
import { _addNewServer } from './_add-new-server';
import { WebSocketMessage } from '@models';
import { sendLog } from './logs/send-log';

export class LogsChannel {
	static initialize(): WebSocketServer {
		global.globalLogsChannel.removeAllListeners();
		global.globalLogsChannel = new WebSocketServer({
			noServer: true,
			skipUTF8Validation: true,
		});

		global.globalLogsChannel.broadcast = _broadcast;

		global.globalLogsChannel.on('connection', (ws, req) => {
			const server = _addNewServer({ ws, req });

			setTimeout(() => {
				global.globalLogsChannel.broadcast?.({
					type: 'event',
					from: server.id,
					data: {
						event: 'new_server',
					},
				});
			}, 1000);

			ws.on('error', (error) =>
				_onError({ error, restart: LogsChannel.initialize }),
			);

			ws.on('message', (text) => _onMessage({ server, text: text }));

			ws.on('close', () => _onClientClose({ server }));
		});

		global.globalLogsChannel.on('close', () =>
			_onServerClose({ restart: LogsChannel.initialize }),
		);

		global.globalLogsChannel.on('error', (error) =>
			_onError({ error, restart: LogsChannel.initialize }),
		);

		return global.globalLogsChannel;
	}

	// static sendLog(message: WebSocketMessage) {
	static sendLog = sendLog;
}

function _broadcast(message: WebSocketMessage) {
	global.globalLogsChannel.clients.forEach((client) => {
		if (client.readyState === client.OPEN) {
			client.send(JSON.stringify(message));
		}
	});
	// const users = Object.values(global.users);
	// users.forEach((user) => {
	// 	user.client.send(JSON.stringify(message));
	// });
}
