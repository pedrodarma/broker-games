import { Game } from '@models';

type GamesType = Record<string, string>;
type DefaultGame = Omit<Game, 'id'>;
// type Games = DefaultGame[];

const _games = {
	/** Naval Battle */
	NBT: 'Naval Battle',
	/** Rock Paper Scissors */
	RPS: 'Rock Paper Scissors',
	/** Quick Tac Toe */
	QTT: 'Quick Tac Toe',
	/** Carnaval World */
	CNW: 'Carnaval World',
};

export type GameIDs = keyof typeof _games;
type Games = { [key in GameIDs]: DefaultGame };

// export type { GameIDs, DefaultGame };

export const games: Record<GameIDs, DefaultGame> = {
	NBT: {
		name: _games.NBT,
		maxPlayers: 2,
		minPlayers: 2,
	},
	RPS: {
		name: _games.RPS,
		maxPlayers: 2,
		minPlayers: 2,
	},
	QTT: {
		name: _games.QTT,
		maxPlayers: 2,
		minPlayers: 2,
	},
	CNW: {
		name: _games.CNW,
		maxPlayers: 10,
		minPlayers: 2,
	},
};
