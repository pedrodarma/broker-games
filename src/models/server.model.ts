import { WebSocket } from 'ws';

/**
 * ---
 * #### Server Model
 *
 * Represents a server connected to the broker.
 *
 * ---
 * <br/>&nbsp;<br/>
 */
export interface Server {
	id: string;
	client: WebSocket;
	createdAt: Date;
	updatedAt: Date;
}
