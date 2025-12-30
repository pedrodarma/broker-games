/**
 * ---
 * #### Game represents a game entity with its properties.
 *
 * Each game has a unique `id`, a `name`, and associated `images`.
 *
 * The `maxPlayers` and `minPlayers` fields define the player limits for the game.
 *
 * ---
 * <br/>&nbsp;<br/>
 */
export interface Game {
	id: string;
	name: string;
	// images: GameImages;
	metadata: Record<string, any>;
	maxPlayers: number;
	minPlayers: number;
	// createdAt: Date;
	// updatedAt: Date;
}

/**
 * ---
 * #### GameImages represents the images associated with a game.
 *
 * It includes a `thumbnail`, a `banner`, and an array of `screenshots`.
 *
 * Example:
 * ```typescript
 * const gameImages: GameImages = {
 *   thumbnail: "https://example.com/thumbnail.jpg",
 *   banner: "https://example.com/banner.jpg",
 *   screenshots: [
 *     "https://example.com/screenshot1.jpg",
 *     "https://example.com/screenshot2.jpg"
 *   ]
 * };
 * ```
 * ---
 * <br/>&nbsp;<br/>
 */
// interface GameImages {
// 	thumbnail: string;
// 	banner: string;
// 	screenshots: string[];
// }

// type DataValue = string | number | boolean | null | undefined | object;
