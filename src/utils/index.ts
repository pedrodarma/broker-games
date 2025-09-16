import { IDUtils } from './id.utils';

export * from './id.utils';

export const Utils = {
	/**
	 * ---
	 *
	 * Generates a new unique identifier (UUID).
	 *
	 * ```typescript
	 * Utils.generateUUID(); // e.g., "3b12f1df-5232-4e3c-9e6b-8f9e5f1c2d3e"
	 * ```
	 */
	generateUUID: IDUtils.generate,
	/**
	 * ---
	 *
	 * Generates a short unique identifier.
	 *
	 * ```typescript
	 * Utils.generateShortID(); // e.g., "5232-9e6b"
	 * ```
	 */
	generateShortID: IDUtils.generateShortID,
};

export default Utils;
