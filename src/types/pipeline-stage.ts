import type { PipelineContext } from './pipeline-context.js';
import type { Result } from './result.js';

/**
 * Represents a stage in a processing pipeline that operates on a context object
 * and returns a Result indicating success or failure.
 *
 * @template T - The specific PipelineContext type this stage operates on.
 *              Defaults to the base PipelineContext if not specified.
 *
 * @param context - The pipeline context object containing the current state
 * @returns A Promise that resolves to a Result containing either the modified context
 *          or an error if the stage failed
 *
 * @example
 * ```typescript
 * // Example pipeline stage that validates user data
 * const validateUserStage: PipelineStage<UserContext> = async (context) => {
 *   try {
 *     // Validation logic here
 *     return { ok: true, value: { ...context, isValid: true } };
 *   } catch (error) {
 *     return { ok: false, error };
 *   }
 * };
 * ```
 */
type PipelineStage<T extends PipelineContext = PipelineContext> = (
	context: T
) => Promise<Result<T>>;

export type { PipelineStage };
