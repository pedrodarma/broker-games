import { Game } from '@models';
type DefaultGame = Omit<Game, 'id'>;
type Games = DefaultGame[];
export declare const games: Games;
export {};
