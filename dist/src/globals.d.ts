import { BrokerServer, GameRoom } from '@models';
import { User } from './models/user.model';
declare global {
    var ip: string;
    /**
     * WebSocketServer for users to talk to each other.
     */
    var globalChatChannel: BrokerServer;
    /**
     * List of all current games
     */
    var games: Record<string, GameRoom>;
    var users: Record<string, User>;
}
