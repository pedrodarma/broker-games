import { WebSocketServer } from 'ws';
import { WebSocketMessage } from '@models';

/**
 * WebSocketServer with broadcast method
 */
export interface BrokerServer extends WebSocketServer {
	broadcast?: (message: WebSocketMessage) => void;
}
