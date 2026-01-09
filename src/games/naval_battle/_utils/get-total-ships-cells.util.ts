import { ships } from './ships.util';

export function getTotalShipsCells(): number {
	let total = 0;
	for (const ship of ships) {
		total += ship.size * ship.count;
	}
	return total;
}
