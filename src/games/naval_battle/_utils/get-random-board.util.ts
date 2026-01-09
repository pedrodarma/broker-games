import { getClearBoard } from './get-clear-board.util';
import { ships } from './ships.util';

export function getRandomBoard() {
	const board: Record<string, string[]> = getClearBoard();
	const rows = Object.keys(board);
	const cols = board[rows[0]].map((_, i) => i);

	const placeShip = (size: number, symbol: string) => {
		let placed = false;
		while (!placed) {
			const horizontal = Math.random() < 0.5;
			const row = rows[Math.floor(Math.random() * rows.length)];
			const col = Math.floor(Math.random() * cols.length);

			if (horizontal) {
				if (col + size > cols.length) continue;
				const segment = board[row].slice(col, col + size);
				if (
					segment.includes('A') ||
					segment.includes('C') ||
					segment.includes('D') ||
					segment.includes('S') ||
					segment.includes('B')
				)
					continue;
				for (let i = 0; i < size; i++) board[row][col + i] = symbol;
			} else {
				const rowIndex = rows.indexOf(row);
				if (rowIndex + size > rows.length) continue;
				const segment = rows
					.slice(rowIndex, rowIndex + size)
					.map((r) => board[r][col]);
				if (
					segment.includes('A') ||
					segment.includes('C') ||
					segment.includes('D') ||
					segment.includes('S') ||
					segment.includes('B')
				)
					continue;
				for (let i = 0; i < size; i++) board[rows[rowIndex + i]][col] = symbol;
			}

			placed = true;
		}
	};

	for (const ship of ships) {
		for (let i = 0; i < ship.count; i++) {
			placeShip(ship.size, ship.symbol);
		}
	}

	return board;
}
