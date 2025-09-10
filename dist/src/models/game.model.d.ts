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
    id: number;
    name: string;
    maxPlayers: number;
    minPlayers: number;
}
