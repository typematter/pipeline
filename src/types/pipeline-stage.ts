import type { PipelineContext } from './pipeline-context.js';
import type { Result } from './result.js';

/**
 * Represents a stage in a pipeline.
 *
 * A `PipelineStage` is a function that takes an optional `PipelineContext` object and returns a `Promise`
 * that resolves to a `Result` object. The `Result` object indicates whether the stage was successful or not.
 * If successful, the `Result` object contains the updated `PipelineContext` to be passed to the next stage.
 *
 * @template T - The type of the context object passed through the pipeline stages.
 * @param {PipelineContext} [context] - The context object passed to the stage.
 * @returns {Promise<Result<PipelineContext>>} A promise that resolves to a result object indicating the outcome of the stage.
 *
 * @example
 * // Define a pipeline stage that adds a property to the context
 * const stage: PipelineStage = async (context) => {
 *   if (context) {
 *     return success({ ...context, step1: true });
 *   }
 *   return failure('Context is missing');
 * };
 */
type PipelineStage = (context: PipelineContext) => Promise<Result<PipelineContext>>;

export type { PipelineStage };
