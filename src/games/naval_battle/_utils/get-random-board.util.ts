import { getClearBoard } from './get-clear-board.util';
import { ships } from './ships.util';

// export function getRandomBoard() {
// 	const board: Record<string, string[]> = getClearBoard();
// 	const rows = Object.keys(board);
// 	const cols = board[rows[0]].map((_, i) => i);

// 	const placeShip = (size: number, symbol: string) => {
// 		let placed = false;
// 		while (!placed) {
// 			const horizontal = Math.random() < 0.5;
// 			const row = rows[Math.floor(Math.random() * rows.length)];
// 			const col = Math.floor(Math.random() * cols.length);

// 			if (horizontal) {
// 				if (col + size > cols.length) continue;
// 				const segment = board[row].slice(col, col + size);
// 				if (
// 					segment.includes('A') ||
// 					segment.includes('C') ||
// 					segment.includes('D') ||
// 					segment.includes('S') ||
// 					segment.includes('B')
// 				)
// 					continue;
// 				for (let i = 0; i < size; i++) board[row][col + i] = symbol;
// 			} else {
// 				const rowIndex = rows.indexOf(row);
// 				if (rowIndex + size > rows.length) continue;
// 				const segment = rows
// 					.slice(rowIndex, rowIndex + size)
// 					.map((r) => board[r][col]);
// 				if (
// 					segment.includes('A') ||
// 					segment.includes('C') ||
// 					segment.includes('D') ||
// 					segment.includes('S') ||
// 					segment.includes('B')
// 				)
// 					continue;
// 				for (let i = 0; i < size; i++) board[rows[rowIndex + i]][col] = symbol;
// 			}

// 			placed = true;
// 		}
// 	};

// 	for (const ship of ships) {
// 		for (let i = 0; i < ship.count; i++) {
// 			placeShip(ship.size, ship.symbol);
// 		}
// 	}

// 	return board;
// }

const SHIP_SYMBOLS = ['A', 'C', 'D', 'S', 'B'] as const;
type ShipSymbol = (typeof SHIP_SYMBOLS)[number];

// const ships = [
//   { size: 5, count: 1, symbol: "A" },
//   { size: 4, count: 1, symbol: "C" },
//   { size: 3, count: 2, symbol: "D" },
//   { size: 2, count: 3, symbol: "S" },
//   { size: 1, count: 2, symbol: "B" },
// ] as const;

function isOccupied(cell: string) {
	return SHIP_SYMBOLS.some((s) => cell.startsWith(s));
}

function canPlace(
	board: Record<string, string[]>,
	rows: string[],
	rowIndex: number,
	colIndex: number,
	size: number,
	horizontal: boolean,
): boolean {
	for (let i = 0; i < size; i++) {
		const r = horizontal ? rowIndex : rowIndex + i;
		const c = horizontal ? colIndex + i : colIndex;

		// percorre vizinhança 3x3
		for (let dr = -1; dr <= 1; dr++) {
			for (let dc = -1; dc <= 1; dc++) {
				const nr = r + dr;
				const nc = c + dc;

				if (nr < 0 || nr >= rows.length) continue;
				if (nc < 0 || nc >= board[rows[0]].length) continue;

				if (isOccupied(board[rows[nr]][nc])) {
					return false;
				}
			}
		}
	}
	return true;
}

export function getRandomBoard(): Record<string, string[]> {
	const board: Record<string, string[]> = Object.fromEntries(
		Object.entries(getClearBoard()).map(([k, v]) => [k, [...v]]),
	) as Record<string, string[]>;

	const rows = Object.keys(board);
	const cols = board[rows[0]].map((_, i) => i);

	let shipId = 0;

	// const placeShip = (size: number, symbol: ShipSymbol) => {
	//   const MAX_ATTEMPTS = 1000;

	//   for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
	//     const horizontal = Math.random() < 0.5;
	//     const rowIndex = Math.floor(Math.random() * rows.length);
	//     const colIndex = Math.floor(Math.random() * cols.length);

	//     if (horizontal) {
	//       if (colIndex + size > cols.length) continue;

	//       const cells = board[rows[rowIndex]].slice(colIndex, colIndex + size);
	//       if (cells.some(isOccupied)) continue;

	//       for (let i = 0; i < size; i++) {
	//         board[rows[rowIndex]][colIndex + i] = `${symbol}_${shipId}_${i}`;
	//       }
	//       shipId++;
	//       return;
	//     } else {
	//       if (rowIndex + size > rows.length) continue;

	//       const cells = rows
	//         .slice(rowIndex, rowIndex + size)
	//         .map(r => board[r][colIndex]);

	//       if (cells.some(isOccupied)) continue;

	//       for (let i = 0; i < size; i++) {
	//         board[rows[rowIndex + i]][colIndex] = `${symbol}_${shipId}_${i}`;
	//       }
	//       shipId++;
	//       return;
	//     }
	//   }

	//   throw new Error(`Não foi possível posicionar o navio ${symbol}`);
	// };
	const placeShip = (size: number, symbol: string) => {
		const MAX_ATTEMPTS = 1000;

		for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
			const horizontal = Math.random() < 0.5;
			const rowIndex = Math.floor(Math.random() * rows.length);
			const colIndex = Math.floor(Math.random() * cols.length);

			if (horizontal) {
				if (colIndex + size > cols.length) continue;
			} else {
				if (rowIndex + size > rows.length) continue;
			}

			if (!canPlace(board, rows, rowIndex, colIndex, size, horizontal)) {
				continue;
			}

			// posiciona
			for (let i = 0; i < size; i++) {
				const r = horizontal ? rowIndex : rowIndex + i;
				const c = horizontal ? colIndex + i : colIndex;
				board[rows[r]][c] = `${symbol}_${shipId}_${i}`;
			}

			shipId++;
			return;
		}

		throw new Error(`Não foi possível posicionar o navio ${symbol}`);
	};

	for (const ship of ships) {
		for (let i = 0; i < ship.count; i++) {
			placeShip(ship.size, ship.symbol);
		}
	}

	return board;
}
