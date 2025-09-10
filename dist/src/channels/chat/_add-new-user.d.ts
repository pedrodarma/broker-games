import { IncomingMessage } from 'http';
import { WebSocket } from 'ws';
import { User } from '@models';
interface Props {
    ws: WebSocket;
    req: IncomingMessage;
}
export declare function _addNewUser({ ws, req }: Props): User;
export {};
