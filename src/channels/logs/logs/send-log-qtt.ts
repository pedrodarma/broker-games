import { GameIDs } from '@constants';
import { WebSocketMessage } from '@models';

export function sendQuickTacToeLog(hash: string, type: string) {
	const players = Object.values(global.games[hash].players);
	const playerX = players.find((p) => p.data.symbol.toUpperCase() === 'X');
	const playerO = players.find((p) => p.data.symbol.toUpperCase() === 'O');
	const data: LogQuickTacToe = {
		gameKey: 'QTT',
		type: type,
		hash: hash,
		createdAt: global.games[hash].createdAt,
		updatedAt: global.games[hash].updatedAt,
		startedAt: global.games[hash].startedAt,
		finishedAt: global.games[hash].finishedAt,
		mode: global.games[hash].gameMode,
		winner: global.games[hash].winner,
		status: global.games[hash].status,
		playerXId: playerX!.userId,
		playerOId: playerO!.userId,
		playerXMoves: playerX!.data.moves,
		playerOMoves: playerO!.data.moves,
	};
	const logMessage: WebSocketMessage = {
		type: 'log',
		from: 'system',
		to: 'logs',
		data: data as Record<string, any>,
	};
	global.globalLogsChannel.broadcast?.(logMessage);
}

interface LogQuickTacToe extends Log {
	type: string; // timeout, move, win, draw, game_over, etc.
	mode: string;
	winner?: string;
	playerXId: string;
	playerOId: string;
	playerXMoves: string[];
	playerOMoves: string[];
}

interface Log {
	gameKey: GameIDs;
	hash: string;
	status?: string;
	createdAt: Date;
	updatedAt: Date;
	startedAt?: Date;
	finishedAt?: Date;
}
