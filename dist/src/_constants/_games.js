"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.games = void 0;
const _gameNames = {
    CHESS: 'Chess',
    NAVAL_BATTLE: 'Naval Battle',
    POKER: 'Poker',
    RPS: 'Rock Paper Scissors',
    TICTACTOE: 'Tic Tac Toe',
    CARNAVAL: 'Carnaval',
};
exports.games = [
    {
        name: _gameNames.NAVAL_BATTLE,
        maxPlayers: 2,
        minPlayers: 2,
        // images: {
        // 	thumbnail: 'https://i.ibb.co/0j3m0ZV/naval-battle-thumb.png',
        // 	banner: 'https://i.ibb.co/7G8m2vD/naval-battle-banner.png',
        // 	screenshots: [
        // 		'https://i.ibb.co/0j3m0ZV/naval-battle-thumb.png',
        // 		'https://i.ibb.co/7G8m2vD/naval-battle-banner.png',
        // 	],
        // },
    },
];
const navalRules = {
    gridSize: 10,
    shipTypes: [
        { name: 'Carrier', size: 5, count: 1 },
        { name: 'Battleship', size: 4, count: 1 },
        { name: 'Cruiser', size: 3, count: 1 },
        { name: 'Submarine', size: 3, count: 1 },
        { name: 'Destroyer', size: 2, count: 1 },
    ],
    maxTurns: 100,
};
