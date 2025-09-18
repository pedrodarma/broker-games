import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { router } from '@routes';

import { ChatChannel } from '@channels';

const app: express.Application = express();
const server = createServer(app);

app.use(cors());
app.set('trust proxy', true);

app.use('/', router);

const _chatChannel = ChatChannel.initialize();

server.on('upgrade', (request, socket, head) => {
	const pathname = request.url;

	// eslint-disable-next-line no-console
	console.log({ pathname });

	if (pathname === undefined) {
		socket.destroy();
		return;
	}

	if (pathname?.startsWith('/chat')) {
		_chatChannel.handleUpgrade(request, socket, head, (ws) => {
			_chatChannel.emit('connection', ws, request);
		});
		return;
	}

	/**
	 * /games/:hash?player=playerId to play
	 * /games/:hash to watch
	 */
	if (pathname?.startsWith('/game/')) {
		const hash = pathname.split('/game/')[1]?.split('?')[0];

		if (global.games[hash] === undefined) {
			socket.destroy();
			return;
		}

		global.games[hash].socketChannel.handleUpgrade(
			request,
			socket,
			head,
			(ws) => {
				global.games[hash].socketChannel.emit('connection', ws, request);
			},
		);
		return;
	}
});

const port = process.env.PORT || 8070;
server.listen(port, () => {
	// eslint-disable-next-line no-console
	console.warn(`Server listening on port ${port}`);
});
