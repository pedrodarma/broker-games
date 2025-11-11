import { WebSocket } from 'ws';
import { Game } from './game.model';
import { BrokerServer } from './broker-server.model';
import { GameIDs } from '@constants/game_types';

/**
 * ---
 * #### GameRoom extends Game and represents a game room where players can join and play.
 *
 * Each game room has a unique `hash`, a list of `players`, and a list of `watchers`.
 *
 * The `status` field indicates the current state of the game room, which can be
 * `waiting`, `playing`, or `finished`.
 *
 * ---
 * <br/>&nbsp;<br/>
 */
export interface GameRoom extends Game {
	key: GameIDs;
	/**
	 * Unique hash identifier for the game room
	 */
	hash: string;
	/**
	 * Players in the game room, mapped by their UserId
	 */
	players: Record<UserId, Player>;
	/**
	 * List of UserIds watching the game room
	 */
	watchers: UserId[];
	/**
	 * Current status of the game room
	 *
	 * - 'waiting': The game room is waiting for players to join.
	 * - 'playing': The game is currently in progress.
	 * - 'finished': The game has ended.
	 */
	status: GameRoomStatus;
	/**
	 * WebSocket channel for real-time communication within the game room
	 */
	socketChannel: BrokerServer;
	winner?: string;
	gameMode: GameModes;
	createdAt: Date;
	updatedAt: Date;
	startedAt?: Date;
	finishedAt?: Date;
}

/**
 * ---
 * #### Player represents a user in the game room.
 *
 * Each player has a unique `userId` and associated `data`.
 * The `data` field can store various information about the player,
 * such as their score, status, or any other relevant details.
 *
 * ---
 * <br/>&nbsp;<br/>
 */
export interface Player {
	userId: UserId;
	client?: WebSocket;
	data: DataValue;
}

export type GameModes = 'local_pvp' | 'local_bot' | 'online';

/**
 * ---
 * #### GameRoomStatus can be one of the following:
 *
 * - 'waiting': The game room is waiting for players to join.
 * - 'playing': The game is currently in progress.
 * - 'finished': The game has ended.
 *
 * ---
 * <br/>&nbsp;<br/>
 */
type GameRoomStatus = 'waiting' | 'playing' | 'finished';

/**
 * ---
 * #### UserId is a string representing the unique identifier of a user.
 *
 *
 * The `userId` is a hashed string that uniquely identifies a user in the system.
 * It is used to associate players and watchers with their respective user accounts.
 *
 * Example:
 * ```typescript
 * const userId: UserId = "ASDO00-FFWEFE-12345";
 * ```
 * ---
 * <br/>&nbsp;<br/>
 */
type UserId = string;

// type DataValue = string | number | boolean | null | undefined | object;
type DataValue = Record<string, any>;
