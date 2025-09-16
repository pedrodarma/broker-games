import { v4 as uuidv4 } from 'uuid';

/**
 * ---
 * #### IDUtils
 *
 * A utility object for generating unique identifiers (UUIDs).
 *
 * - `generate()` => `3b12f1df-5232-4e3c-9e6b-8f9e5f1c2d3e`
 * - `generateShortID()` => `5232-9e6b`
 *
 * ---
 * <br/>&nbsp;<br/>
 */
export const IDUtils: IDUtils = {
	generate: () => uuidv4(),
	generateShortID: _generateShortID,
};

interface IDUtils {
	/**
	 * ---
	 *
	 * Generates a new unique identifier (UUID).
	 *
	 * ```typescript
	 * IDUtils.generate(); // e.g., "3b12f1df-5232-4e3c-9e6b-8f9e5f1c2d3e"
	 * ```
	 */
	generate: () => string;
	/**
	 * ---
	 *
	 * Generates a short unique identifier.
	 *
	 * ```typescript
	 * IDUtils.generateShortID(); // e.g., "5232-9e6b"
	 * ```
	 */
	generateShortID: () => string;
}

function _generateShortID() {
	const uuid = uuidv4(); // "3b12f1df-5232-4e3c-9e6b-8f9e5f1c2d3e"
	const splited = uuid.split('-'); // [ '3b12f1df', '5232', '4e3c', '9e6b', '8f9e5f1c2d3e' ]
	const short = `${splited[1]}-${splited[3]}`; // "5232-9e6b"
	return short;
}
// export class ID {
// 	static generate() {
// 		return uuidv4();

// 		// return Math.random().toString(36).substring(2, 15);
// 	}

// 	// static generateWithPrefix(prefix: string) {
// 	//   return `${prefix}-${ID.generate()}`;
// 	// }

// 	// static generateWithSuffix(suffix: string) {
// 	//   return `${ID.generate()}-${suffix}`;
// 	// }

// 	// static generateWithPrefixAndSuffix(prefix: string, suffix: string) {
// 	//   return `${prefix}-${ID.generate()}-${suffix}`;
// 	// }
// }
