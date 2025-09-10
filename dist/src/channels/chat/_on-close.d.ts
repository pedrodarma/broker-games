import '../../globals';
import { User } from '@models';
interface ServerCloseProps {
    restart: () => void;
}
export declare function _onServerClose({ restart }: ServerCloseProps): void;
interface ClientCloseProps {
    user: User;
}
export declare function _onClientClose({ user }: ClientCloseProps): void;
export {};
