import { RawData } from 'ws';
import '../../globals';
import { User, WebSocketMessage } from '@models';

interface Props {
	user?: User;
	text: RawData;
}

function _formatMessage(message: string) {
	try {
		const data = message.replace(/(['"])?([a-zA-Z_]+)(['"])?:/g, '"$2": ');
		return JSON.parse(data);
	} catch {
		if (message === 'connected') {
			return { action: 'register' };
		}
		return message;
	}
}

export function _onMessage({ user, text }: Props) {
	try {
		if (text) {
			const formated = Buffer.from(text.toString()).toString('ascii');
			const message: WebSocketMessage = _formatMessage(formated);

			if (message && message.type) {
				switch (message.type.toLowerCase()) {
					case 'log':
						// eslint-disable-next-line no-console
						// console.log(message);
						break;
					case 'action':
						// eslint-disable-next-line no-console
						// console.log(message);
						break;
					case 'event':
						// eslint-disable-next-line no-console
						// console.log(message);

						if (!message.from || !message.to) {
							return;
						}

						const event = message.data.event;

						if (!event) {
							return;
						}

						break;
					case 'command':
						// eslint-disable-next-line no-console
						// console.log(message);

						if (!message.from || !message.to) {
							return;
						}

						const command = message.data.command;

						if (!command) {
							return;
						}

						break;
					case 'ping':
						// user.client.send('pong');
						break;
					default:
						// eslint-disable-next-line no-console
						console.log('UNHANDLED TYPE ', message);
						break;
				}
			} else {
				if (text.toString() === 'ping') {
					// user.client.send('pong');
					return;
				}
				// eslint-disable-next-line no-console
				console.log('MESSAGE WITHOUT TYPE ', message);
			}
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log('====================================');
		// eslint-disable-next-line no-console
		console.log('EXCEPTION: ', error);
		// eslint-disable-next-line no-console
		console.log('TEXT: ', text);
		// eslint-disable-next-line no-console
		console.log('====================================');
	}
}
