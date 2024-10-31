import type { PipelineContext } from '$types/pipeline-context.js';
import type { PipelineStage } from '$types/pipeline-stage.js';
import type { Result } from '$types/result.js';
import failure from './failure.js';
import success from './success.js';

/**
 * Composes multiple pipeline stages into a single pipeline function.
 *
 * This function takes multiple `PipelineStage` functions and returns a new `PipelineStage` function
 * that executes the provided stages in sequence. Each stage receives the context from the previous stage.
 * If any stage fails, the pipeline stops and returns the failure result.
 *
 * @param {...PipelineStage[]} stages - The pipeline stages to compose.
 * @returns {PipelineStage} A composed pipeline stage function.
 *
 * @example
 * // Define some pipeline stages
 * const stage1: PipelineStage = async (context) => success({ ...context, step1: true });
 * const stage2: PipelineStage = async (context) => success({ ...context, step2: true });
 *
 * // Compose the stages into a single pipeline
 * const pipeline = compose(stage1, stage2);
 *
 * // Execute the pipeline
 * const result = await pipeline({});
 * if (result.ok) {
 *   console.log(result.value); // { step1: true, step2: true }
 * } else {
 *   console.error(result.error);
 * }
 */
const compose: (...stages: PipelineStage[]) => PipelineStage =
	(...stages) =>
	async (context: PipelineContext = {}): Promise<Result<PipelineContext>> => {
		let currentContext = context;

		for (const stage of stages) {
			try {
				const result = await stage(currentContext);

				if (result.ok) {
					currentContext = result.value;
				} else {
					return result;
				}
			} catch (error) {
				return failure(error);
			}
		}

		return success(currentContext);
	};

export default compose;
