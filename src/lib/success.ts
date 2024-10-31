import type { Result } from '$types/result.js';

/**
 * Creates a successful result object.
 *
 * This function is used to wrap a value in a `Result` object indicating a successful operation.
 * The resulting object will have the `ok` property set to `true` and the `value` property set to the provided value.
 *
 * @template T - The type of the value being wrapped.
 * @param {T} value - The value to wrap in a successful result.
 * @returns {Result<T>} An object representing a successful result containing the provided value.
 *
 * @example
 * // Creating a successful result with a string value
 * const result = success('Operation completed successfully');
 * console.log(result); // { ok: true, value: 'Operation completed successfully' }
 *
 * @example
 * // Creating a successful result with an object value
 * const result = success({ id: 1, name: 'John Doe' });
 * console.log(result); // { ok: true, value: { id: 1, name: 'John Doe' } }
 */
const success = <T>(value: T): Result<T> => ({
	ok: true,
	value
});

export default success;
