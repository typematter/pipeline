/**
 * Represents the result of an operation that can either succeed or fail.
 *
 * The `Result` type is a discriminated union that can represent either a successful operation with a value
 * or a failed operation with an error. This type is useful for functions that can return either a success
 * or an error, providing a consistent way to handle both outcomes.
 *
 * @template T - The type of the value in the case of a successful result.
 * @template E - The type of the error in the case of a failed result. Defaults to `Error`.
 *
 * @example
 * // A function that returns a successful result
 * function getSuccessResult(): Result<string> {
 *   return { ok: true, value: 'Success' };
 * }
 *
 * @example
 * // A function that returns a failed result
 * function getFailureResult(): Result<string> {
 *   return { ok: false, error: new Error('Failure') };
 * }
 */
type Result<T, E = Error> =
	| {
			ok: true;
			value: T;
	  }
	| {
			ok: false;
			error: E;
	  };

export type { Result };
