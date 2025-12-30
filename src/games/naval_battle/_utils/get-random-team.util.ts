const TEAMS = ['SAILOR_GOOD', 'PIRATE'] as const;

export function getRandomTeam(): string {
	const randomIndex = Math.floor(Math.random() * TEAMS.length);
	return TEAMS[randomIndex];
}
