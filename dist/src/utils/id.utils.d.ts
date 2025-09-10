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
export declare const IDUtils: {
    generate: () => string;
};
