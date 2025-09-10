import { IncomingMessage } from 'http';
import { WebSocket } from 'ws';
interface Props {
    ws: WebSocket;
    req: IncomingMessage;
}
export declare function _addNewUser({ ws, req }: Props): string;
export {};
