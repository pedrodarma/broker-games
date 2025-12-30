import '../../globals';
import { Player } from '@models';

interface ServerCloseProps {
	hash: string;
	restart: () => void;
}

export function _onServerClose({ hash, restart }: ServerCloseProps) {
	global.games[hash].socketChannel.close();

	// eslint-disable-next-line no-console
	console.log('====================================');
	// eslint-disable-next-line no-console
	console.log('SERVER CLOSE: ', hash);
	// eslint-disable-next-line no-console
	console.log('====================================');

	setTimeout(() => {
		restart();
	}, 3000);
}

interface ClientCloseProps {
	hash: string;
	player: Player;
}

export function _onClientClose({ hash, player }: ClientCloseProps) {
	player.client?.close();
	global.games[hash].players[player.userId].client = undefined;
	// eslint-disable-next-line no-console
	console.log(`Player ${player.userId} disconnected`);
	// eslint-disable-next-line no-console
	console.log(`Player ${player.userId} closed`);
	// eslint-disable-next-line no-console
	console.log('====================================');
	// delete global.users[user.id];
	setTimeout(() => {
		global.games[hash].socketChannel.broadcast?.({
			type: 'event',
			from: player.userId,
			data: {
				event: 'user_disconnected',
			},
		});

		const totalConnected = Object.values(global.games[hash].players).filter(
			(p) => p.client !== undefined,
		).length;

		if (totalConnected === 0) {
			// eslint-disable-next-line no-console
			console.log(`No players connected. Closing game ${hash}`);
			global.games[hash].socketChannel.close();
			delete global.games[hash];
		}
	}, 1000);
}
