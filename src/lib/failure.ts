import type { Result } from '$types/result.js';

/**
 * Custom error class for pipeline-specific errors.
 * Extends the standard `Error` class to provide pipeline-specific error handling.
 *
 * @example
 * ```typescript
 * // Direct usage
 * throw new PipelineError('Data validation failed');
 *
 * // Checking error type
 * if (error instanceof PipelineError) {
 *   // Handle pipeline-specific error
 * }
 * ```
 */
class PipelineError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PipelineError';
	}
}

/**
 * Creates a failure `Result` object, standardizing error handling within the pipeline.
 * This utility function ensures all errors are properly wrapped in a `PipelineError`
 * and converted to a failure Result.
 *
 * The function handles three types of error inputs:
 * 1. `PipelineError` instances (passed through as-is)
 * 2. Standard `Error` instances (message is extracted and wrapped in `PipelineError`)
 * 3. Any other value (converted to string and wrapped in `PipelineError`)
 *
 * @template T - The type parameter of the `Result` (unused in failure case but required for type compatibility)
 * @param error - The error value to wrap. Can be any type, but will be converted to `PipelineError`.
 * @returns A `Result` object with `ok: false` and a `PipelineError`
 *
 * @example
 * // With PipelineError
 * const result1 = failure(new PipelineError('Pipeline stage failed'));
 * // Result<T, PipelineError> with original PipelineError
 *
 * @example
 * // With standard Error
 * const result2 = failure(new Error('Something went wrong'));
 * // Result<T, PipelineError> with message "Something went wrong"
 *
 * @example
 * // With string
 * const result3 = failure('Invalid input');
 * // Result<T, PipelineError> with message "Invalid input"
 *
 * @example
 * // Usage in pipeline stage
 * const processDataStage: PipelineStage<DataContext> = async (context) => {
 *   try {
 *     // Processing logic
 *     return success({ ...context, processed: true });
 *   } catch (error) {
 *     return failure(error);
 *   }
 * };
 *
 * @example
 * // Using with custom error handling
 * const handleError = (error: unknown) => {
 *   console.error('Pipeline failed:', error);
 *   return failure(error);
 * };
 *
 * @see {@link Result} - The Result type this function creates
 * @see {@link PipelineError} - The custom error class used for standardization
 */
const failure = <T>(error: unknown): Result<T, PipelineError> => ({
	ok: false,
	error:
		error instanceof PipelineError
			? error
			: new PipelineError(error instanceof Error ? error.message : String(error))
});

export { failure as default, PipelineError };
