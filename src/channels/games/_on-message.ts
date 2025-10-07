import { RawData } from 'ws';
import '../../globals';
import { Player, WebSocketMessage } from '@models';
import { QuickTacToeGame } from '@games';

interface Props {
	hash: string;
	player: Player;
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

export function _onMessage({ hash, player, text }: Props) {
	try {
		if (text) {
			const formated = Buffer.from(text.toString()).toString('ascii');
			const message: WebSocketMessage = _formatMessage(formated);

			if (text.toString() === 'ping' || message.type.toLowerCase() === 'ping') {
				player.client?.send('pong');
				return;
			}

			const gameId = global.games[hash].id;
			switch (gameId.toUpperCase()) {
				case 'QTT':
					QuickTacToeGame.handleMessage(hash, message);
					break;
				default:
					break;
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
