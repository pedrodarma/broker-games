import { WebSocketMessage } from '@models';
import { checkWinner } from '../_utils';

export async function _attack(hash: string, message: WebSocketMessage) {
	const game = global.games[hash];

	if (game === undefined || game.status !== 'playing') return;

	if (message.from === undefined || message.data?.position === undefined) {
		return;
	}

	const gameMode = global.games[hash].gameMode;
	const isAgainstBot = gameMode === 'local_bot';
	// const isLocalPVP = gameMode === 'local_pvp';

	const _row = String(message.data.position)[0].toLocaleLowerCase();
	const _col = parseInt(String(message.data.position)[1], 10);

	const availableRows = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
	if (!availableRows.includes(_row) || _col < 0 || _col > 9) {
		// Invalid position
		return;
	}

	const player = global.games[hash].players[message.from];
	const opponent = Object.values(global.games[hash].players).find(
		(p) => p.userId !== message.from,
	);

	if (!opponent) return;

	const playerBoard = player?.data.board;
	const playerTargetBoard = player?.data.targetBoard;

	const opponentBoard = opponent.data.board;
	const opponentTargetBoard = opponent.data.targetBoard;

	if (opponentTargetBoard[_row][_col] !== '-') {
		// Position already attacked
		return;
	}

	// const attackResult = opponentBoard[_row][_col] !== '-' ? 'x' : '*';
	let attackResult: 'x' | '*';

	const targetCell = opponentBoard[_row][_col];

	if (targetCell !== '-') {
		attackResult = 'x';

		// marca hit no board real
		// opponentBoard[_row][_col] = 'x';
		global.games[hash].players[opponent.userId].data.targetBoard[_row][_col] =
			'x';

		// verifica se afundou
		const shipInfo = parseShipCell(targetCell);

		if (shipInfo) {
			const shipCells = getShipCells(
				opponentBoard,
				shipInfo.symbol,
				shipInfo.shipId,
			);

			if (
				isShipSunk(
					global.games[hash].players[opponent.userId].data.targetBoard,
					shipCells,
				)
			) {
				markWaterAroundShip(hash, opponent.userId, shipCells);

				// reflete no targetBoard do atacante
				for (const { r, c } of shipCells) {
					global.games[hash].players[opponent.userId].data.targetBoard[r][c] =
						'X';
				}

				// espelha a água marcada
				for (const r of Object.keys(opponentBoard)) {
					for (let c = 0; c < opponentBoard[r].length; c++) {
						if (opponentBoard[r][c] === '~') {
							global.games[hash].players[opponent.userId].data.targetBoard[r][
								c
							] = '~';
						}
					}
				}
			}
		}
	} else {
		attackResult = '*';
		global.games[hash].players[opponent.userId].data.targetBoard[_row][_col] =
			'*';
	}

	global.games[hash].players[opponent.userId].data.targetBoard[_row][_col] =
		attackResult;

	const attack: WebSocketMessage = {
		type: 'action',
		from: message.from,
		to: opponent?.userId,
		data: {
			action: 'attack',
			position: message.data.position,
			attackResult: attackResult,
			targetBoard: global.games[hash].players[opponent.userId].data.targetBoard,
		},
	};

	// LogsChannel.sendLog(game.key, hash, 'move');
	global.games[hash].socketChannel.broadcast?.(attack);

	if (checkWinner(hash, message)) {
		return;
	}

	if (isAgainstBot && message.from.includes('bot_') && attackResult === 'x') {
		setTimeout(async () => {
			await _attackBot(hash, { ...message, from: opponent.userId });
		}, 1000);
	}

	if (attackResult !== 'x') {
		setTimeout(async () => {
			global.games[hash].socketChannel.broadcast?.({
				type: 'event',
				from: hash,
				to: opponent.userId,
				data: {
					event: 'your_turn',
				},
			});

			if (isAgainstBot && !message.from.includes('bot_')) {
				setTimeout(async () => {
					await _attackBot(hash, message);
				}, 1000);
			}
		}, 2500);
	}
}

const allPositions = [
	'a0',
	'a1',
	'a2',
	'a3',
	'a4',
	'a5',
	'a6',
	'a7',
	'a8',
	'a9',
	'b0',
	'b1',
	'b2',
	'b3',
	'b4',
	'b5',
	'b6',
	'b7',
	'b8',
	'b9',
	'c0',
	'c1',
	'c2',
	'c3',
	'c4',
	'c5',
	'c6',
	'c7',
	'c8',
	'c9',
	'd0',
	'd1',
	'd2',
	'd3',
	'd4',
	'd5',
	'd6',
	'd7',
	'd8',
	'd9',
	'e0',
	'e1',
	'e2',
	'e3',
	'e4',
	'e5',
	'e6',
	'e7',
	'e8',
	'e9',
	'f0',
	'f1',
	'f2',
	'f3',
	'f4',
	'f5',
	'f6',
	'f7',
	'f8',
	'f9',
	'g0',
	'g1',
	'g2',
	'g3',
	'g4',
	'g5',
	'g6',
	'g7',
	'g8',
	'g9',
	'h0',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'h7',
	'h8',
	'h9',
	'i0',
	'i1',
	'i2',
	'i3',
	'i4',
	'i5',
	'i6',
	'i7',
	'i8',
	'i9',
	'j0',
	'j1',
	'j2',
	'j3',
	'j4',
	'j5',
	'j6',
	'j7',
	'j8',
	'j9',
];
const boardMapping: { [key: string]: number } = {
	a0: 0,
	a1: 1,
	a2: 2,
	a3: 3,
	a4: 4,
	a5: 5,
	a6: 6,
	a7: 7,
	a8: 8,
	a9: 9,
	b0: 10,
	b1: 11,
	b2: 12,
	b3: 13,
	b4: 14,
	b5: 15,
	b6: 16,
	b7: 17,
	b8: 18,
	b9: 19,
	c0: 20,
	c1: 21,
	c2: 22,
	c3: 23,
	c4: 24,
	c5: 25,
	c6: 26,
	c7: 27,
	c8: 28,
	c9: 29,
	d0: 30,
	d1: 31,
	d2: 32,
	d3: 33,
	d4: 34,
	d5: 35,
	d6: 36,
	d7: 37,
	d8: 38,
	d9: 39,
	e0: 40,
	e1: 41,
	e2: 42,
	e3: 43,
	e4: 44,
	e5: 45,
	e6: 46,
	e7: 47,
	e8: 48,
	e9: 49,
	f0: 50,
	f1: 51,
	f2: 52,
	f3: 53,
	f4: 54,
	f5: 55,
	f6: 56,
	f7: 57,
	f8: 58,
	f9: 59,
	g0: 60,
	g1: 61,
	g2: 62,
	g3: 63,
	g4: 64,
	g5: 65,
	g6: 66,
	g7: 67,
	g8: 68,
	g9: 69,
	h0: 70,
	h1: 71,
	h2: 72,
	h3: 73,
	h4: 74,
	h5: 75,
	h6: 76,
	h7: 77,
	h8: 78,
	h9: 79,
	i0: 80,
	i1: 81,
	i2: 82,
	i3: 83,
	i4: 84,
	i5: 85,
	i6: 86,
	i7: 87,
	i8: 88,
	i9: 89,
	j0: 90,
	j1: 91,
	j2: 92,
	j3: 93,
	j4: 94,
	j5: 95,
	j6: 96,
	j7: 97,
	j8: 98,
	j9: 99,
};

export async function _attackBot(hash: string, message: WebSocketMessage) {
	const player = global.games[hash].players[message.from];
	const opponent = Object.values(global.games[hash].players).find(
		(p) => p.userId !== message.from,
	);

	if (!opponent) return;

	let botAttackPosition: string;

	while (true) {
		botAttackPosition = _getRandomPosition(allPositions);
		const _row = String(botAttackPosition)[0].toLocaleLowerCase();
		const _col = parseInt(String(botAttackPosition)[1], 10);

		if (player.data.targetBoard[_row][_col] === '-') {
			break;
		}
	}

	// setTimeout(() => {
	_attack(hash, {
		type: 'action',
		from: opponent.userId,
		to: message.from,
		data: {
			action: 'attack',
			position: botAttackPosition,
		},
	});
	// }, 3500);
}

function _getRandomPosition(availablePositions: string[]): string {
	const randomIndex = Math.floor(Math.random() * availablePositions.length);
	return availablePositions[randomIndex];
}

function markWaterAroundShip(
	hash: string,
	opponentId: string,
	shipCells: { r: string; c: number }[],
) {
	const rows = Object.keys(
		global.games[hash].players[opponentId].data.targetBoard,
	);
	const cols =
		global.games[hash].players[opponentId].data.targetBoard[rows[0]].length;

	for (const { r, c } of shipCells) {
		const rowIndex = rows.indexOf(r);

		for (let dr = -1; dr <= 1; dr++) {
			for (let dc = -1; dc <= 1; dc++) {
				const nr = rowIndex + dr;
				const nc = c + dc;

				if (nr < 0 || nr >= rows.length) continue;
				if (nc < 0 || nc >= cols) continue;

				const rr = rows[nr];

				if (
					global.games[hash].players[opponentId].data.targetBoard[rr][nc] ===
					'-'
				) {
					global.games[hash].players[opponentId].data.targetBoard[rr][nc] = '~';
				}
			}
		}
	}
}

function isShipSunk(board: any, shipCells: { r: string; c: number }[]) {
	return shipCells.every(({ r, c }) => board[r][c].toLowerCase() === 'x');
}

function getShipCells(board: any, symbol: string, shipId: string) {
	const cells: { r: string; c: number }[] = [];

	for (const r of Object.keys(board)) {
		for (let c = 0; c < board[r].length; c++) {
			const parsed = parseShipCell(board[r][c]);
			if (parsed && parsed.symbol === symbol && parsed.shipId === shipId) {
				cells.push({ r, c });
			}
		}
	}

	return cells;
}

function parseShipCell(cell: string) {
	if (!cell || !cell.includes('_')) return null;
	const [symbol, shipId] = cell.split('_');
	return { symbol, shipId };
}
