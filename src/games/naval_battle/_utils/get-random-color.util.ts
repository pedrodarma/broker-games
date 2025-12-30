const COLORS = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'BLACK'] as const;

export function getRandomColor(): string {
	const randomIndex = Math.floor(Math.random() * COLORS.length);
	return COLORS[randomIndex];
}
