import { BrokerServer, GameRoom } from '@models';
import { User } from './models/user.model';
import { WebSocketServer } from 'ws';

declare global {
	var ip: string;

	/**
	 * WebSocketServer for users to talk to each other.
	 */
	var globalChatChannel: BrokerServer;

	/**
	 * WebSocketServer for logs
	 */
	var globalLogsChannel: BrokerServer;

	/**
	 * List of all current games
	 */
	var games: Record<string, GameRoom>;

	var users: Record<string, User>;

	// var cron: Cron;
}

global.globalChatChannel = new WebSocketServer({
	noServer: true,
	skipUTF8Validation: true,
});

global.globalLogsChannel = new WebSocketServer({
	noServer: true,
	skipUTF8Validation: true,
});

global.games = {};
global.users = {};

// global.cron = Cron.initialize();
