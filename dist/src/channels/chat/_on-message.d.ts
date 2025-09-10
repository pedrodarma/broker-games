import { RawData } from 'ws';
import '../../globals';
import { User } from '@models';
interface Props {
    user: User;
    text: RawData;
}
export declare function _onMessage({ user, text }: Props): void;
export {};
