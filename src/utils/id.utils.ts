import { v4 as uuidv4 } from 'uuid';

/**
 * ---
 * #### IDUtils
 *
 * A utility object for generating unique identifiers (UUIDs).
 *
 * - `generate()`: Generates a new UUID (version 4).
 *
 * Example:
 * ```typescript
 * const newId = IDUtils.generate();
 * console.log(newId); // Outputs a unique UUID, e.g., "3b12f1df-5232-4e3c-9e6b-8f9e5f1c2d3e"
 * ```
 * ---
 * <br/>&nbsp;<br/>
 */
export const IDUtils = {
	generate: () => uuidv4(),
};
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
