/**
 * Represents the context object passed through each stage of the pipeline.
 *
 * The `PipelineContext` interface is used to define the shape of the context object that is passed
 * through each stage of the pipeline. This context object can be extended with additional properties
 * as needed by different pipeline stages.
 *
 * @example
 * // Extending the PipelineContext with additional properties
 * interface ExtendedPipelineContext extends PipelineContext {
 *   step1: boolean;
 *   step2: boolean;
 * }
 *
 * // Using the extended context in a pipeline stage
 * const stage: PipelineStage = async (context: ExtendedPipelineContext) => {
 *   if (context.step1) {
 *     return success({ ...context, step2: true });
 *   }
 *   return failure('Step 1 not completed');
 * };
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PipelineContext {}

export type { PipelineContext };
