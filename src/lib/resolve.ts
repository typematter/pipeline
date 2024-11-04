import type { Result } from '$types/result.js';

/**
 * Extracts the value from a `Result` type or throws the error if it's a
 * failure.
 * This utility function converts the `Result` type back into the standard
 * TypeScript success/throw pattern. It's useful when you need to interact with
 * code that expects traditional error handling or when you're at a boundary
 * where you want to handle errors through the try/catch mechanism.
 *
 * @template T - The type of the success value
 * @template E - The type of the error value
 * @param result - The Result object to resolve
 * @returns The value if Result is successful
 * @throws The error value if Result is a failure
 *
 * @example
 * // Successful case
 * const successResult: Result<number> = success(42);
 * try {
 *   const value = resolve(successResult); // Returns 42
 *   console.log(value);
 * } catch (error) {
 *   // This block won't execute
 * }
 *
 * @example
 * // Failure case
 * const failureResult: Result<number> = failure(new Error('Process failed'));
 * try {
 *   const value = resolve(failureResult); // Throws Error
 *   // This line won't execute
 * } catch (error) {
 *   console.error('Caught:', error);
 * }
 *
 * @example
 * // Usage at system boundaries
 * async function processUserData(userId: string): Promise<UserData> {
 *   const result = await pipelineProcessor.process({ userId });
 *   // Convert from Result type to traditional try/catch at system boundary
 *   return resolve(result);
 * }
 *
 * @example
 * // With custom error types
 * interface ValidationError {
 *   code: string;
 *   message: string;
 * }
 * const result: Result<string, ValidationError> = failure({
 *   code: 'INVALID',
 *   message: 'Invalid input'
 * });
 * try {
 *   resolve(result); // Throws ValidationError
 * } catch (error) {
 *   // error will be ValidationError type
 * }
 *
 * @see {@link Result} - The `Result` type this function processes
 * @see {@link success} - Creates a successful `Result`
 * @see {@link failure} - Creates a failure `Result`
 */
const resolve: <T, E>(result: Result<T, E>) => T = (result) => {
	if (result.ok) {
		return result.value;
	} else {
		throw result.error;
	}
};

export default resolve;
