import type { Result } from '$types/result.js';

/**
 * Custom error class for pipeline errors.
 */
class PipelineError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PipelineError';
	}
}

/**
 * Creates a failure result object.
 *
 * This function is used to wrap an error in a `Result` object indicating a failed operation.
 * The resulting object will have the `ok` property set to `false` and the `error` property set to the provided error.
 * If the provided error is not an instance of `PipelineError`, it will be wrapped in a `PipelineError`.
 *
 * @template T - The type of the value that would have been returned on success.
 * @param {unknown} error - The error to wrap in a failure result.
 * @returns {Result<T, PipelineError>} An object representing a failure result containing the provided error.
 *
 * @example
 * // Creating a failure result with a custom error
 * const result = failure(new PipelineError('Something went wrong'));
 * console.log(result); // { ok: false, error: PipelineError: Something went wrong }
 *
 * @example
 * // Creating a failure result with a generic error
 * const result = failure(new Error('Generic error'));
 * console.log(result); // { ok: false, error: PipelineError: Generic error }
 *
 * @example
 * // Creating a failure result with a string error
 * const result = failure('String error');
 * console.log(result); // { ok: false, error: PipelineError: String error }
 */
const failure = <T>(error: unknown): Result<T, PipelineError> => ({
	ok: false,
	error:
		error instanceof PipelineError
			? error
			: new PipelineError(error instanceof Error ? error.message : String(error))
});

export { failure as default, PipelineError };
