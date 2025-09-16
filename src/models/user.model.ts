import { WebSocket } from 'ws';

/**
 * ---
 * #### User Model
 *
 * Represents a user connected to the broker.
 *
 * ---
 * <br/>&nbsp;<br/>
 */
export interface User {
	id: string;
	username: string;
	avatar?: string;
	client: WebSocket;
	createdAt: Date;
	updatedAt: Date;
	settings?: Settings;
	stats?: Stats;
}

interface Settings {
	language: string;
	theme: 'light' | 'dark';
}

interface Stats {
	gamesPlayed: number;
	gamesWon: number;
	gamesLost: number;
	gamesDrawn: number;
	totalScore: number;
	averageScore: number;
}
