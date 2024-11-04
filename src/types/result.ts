/**
 * A discriminated union type representing either a successful or failed operation result.
 * This type is used to handle errors in a type-safe way without throwing exceptions.
 *
 * @template T - The type of the success value
 * @template E - The type of the error value, defaults to Error
 *
 * @property ok - Discriminant property indicating success (true) or failure (false)
 * @property value - Present only when ok is true, contains the success value
 * @property error - Present only when ok is false, contains the error value
 *
 * @example
 * ```typescript
 * // Success case
 * const successResult: Result<number> = {
 *   ok: true,
 *   value: 42
 * };
 *
 * // Error case
 * const errorResult: Result<number> = {
 *   ok: false,
 *   error: new Error('Calculation failed')
 * };
 *
 * // Using with custom error type
 * interface ValidationError {
 *   code: string;
 *   message: string;
 * }
 * const validationResult: Result<string, ValidationError> = {
 *   ok: false,
 *   error: { code: 'INVALID_INPUT', message: 'Input too short' }
 * };
 * ```
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
