import type { Result } from '$types/result.js';

/**
 * Creates a successful `Result` object containing a value.
 * This is a utility function to create the success case of a `Result` type in
 * a more concise and type-safe way.
 *
 * @template T - The type of the success value
 * @param value - The value to wrap in a successful `Result` object
 * @returns A `Result` object with `ok: true` and the provided value
 *
 * @example
 * // Basic usage
 * const numberResult = success(42);
 * // Type: Result<number> = { ok: true, value: 42 }
 *
 * @example
 * // With complex types
 * interface UserData {
 *   id: string;
 *   name: string;
 * }
 *
 * const userData = success({
 *   id: "42",
 *   name: "Alice"
 * });
 * // Type: Result<UserData>
 *
 * @example
 * // Using in async functions
 * async function fetchUser(id: string): Promise<Result<UserData>> {
 *   try {
 *     const user = await db.users.find(id);
 *     return success(user);
 *   } catch (error) {
 *     return failure(error);
 *   }
 * }
 *
 * @see {@link Result} - The Result type this function creates
 */
const success = <T>(value: T): Result<T> => ({
	ok: true,
	value
});

export default success;
