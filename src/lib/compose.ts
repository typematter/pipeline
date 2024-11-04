import type { PipelineContext } from '$types/pipeline-context.js';
import type { PipelineStage } from '$types/pipeline-stage.js';
import failure from './failure.js';
import success from './success.js';

/**
 * Configuration options for the compose function.
 *
 * @property mutate - When true, allows direct mutation of the pipeline context
 *                    between stages instead of creating new context objects.
 *                    This can improve performance but sacrifices immutability.
 */
type ComposeOptions = {
	mutate?: true;
};

/**
 * Function type for composing multiple pipeline stages into a single stage.
 *
 * @template T - The specific PipelineContext type these stages operate on
 * @param stages - Array of pipeline stages to compose
 * @param options - Configuration options for composition behavior
 * @returns A single pipeline stage that executes all stages in sequence
 */
type Compose = <T extends PipelineContext = PipelineContext>(
	stages: PipelineStage<T>[],
	options?: ComposeOptions
) => PipelineStage<T>;

/**
 * Composes multiple pipeline stages into a single stage that executes them in sequence.
 * This function provides a way to combine multiple processing steps into a single
 * pipeline stage while handling errors and context passing between stages.
 *
 * Key features:
 * - Sequential execution of stages
 * - Automatic error propagation
 * - Context passing between stages
 * - Optional mutation mode for performance
 * - Deep cloning of context by default
 *
 * @template T - The specific PipelineContext type these stages operate on
 * @param stages - Array of pipeline stages to execute in sequence
 * @param options - Configuration options:
 *                 - mutate: When true, allows direct mutation of context between stages
 * @returns A single pipeline stage that executes all stages in sequence
 *
 * @example
 * // Basic composition of stages
 * const validateUser: PipelineStage<UserContext> = compose([
 *   validateEmail,
 *   validatePassword,
 *   validateAge
 * ]);
 *
 * @example
 * // Using mutation mode for performance
 * const processBigData: PipelineStage<DataContext> = compose([
 *   loadData,
 *   transformData,
 *   aggregateResults
 * ], { mutate: true });
 *
 * @example
 * // Error handling in composed stages
 * const processOrder: PipelineStage<OrderContext> = compose([
 *   validateOrder,
 *   checkInventory,
 *   processPayment,
 *   generateInvoice
 * ]);
 *
 * const result = await processOrder(orderContext);
 * if (result.ok) {
 *   // All stages completed successfully
 *   console.log('Order processed:', result.value);
 * } else {
 *   // One of the stages failed
 *   console.error('Processing failed:', result.error);
 * }
 *
 * @example
 * // Nested composition
 * const validateUser = compose([checkEmail, checkPassword]);
 * const processUser = compose([validateUser, createProfile]);
 * const completeRegistration = compose([
 *   processUser,
 *   sendWelcomeEmail,
 *   notifyAdmin
 * ]);
 *
 * @example
 * // With type-specific context
 * interface UserContext extends PipelineContext {
 *   email: string;
 *   profile?: UserProfile;
 *   validationStatus?: boolean;
 * }
 *
 * const userPipeline = compose<UserContext>([
 *   validateUserData,
 *   enrichUserProfile,
 *   finalizeUser
 * ]);
 *
 * @remarks
 * By default, the compose function creates a new context object for each stage
 * using structured cloning. This ensures immutability but may impact performance
 * with large contexts. Use the mutate option if performance is critical and
 * you can safely mutate the context.
 *
 * Error handling is automatic - if any stage returns a failure Result or throws
 * an error, the composed pipeline immediately returns that failure without
 * executing remaining stages.
 *
 * @see {@link PipelineStage} - Individual stage type
 * @see {@link PipelineContext} - Context type
 * @see {@link Result} - Return type for pipeline stages
 */
const compose = ((stages, { mutate } = {}) =>
	async (context) => {
		let currentContext = mutate === true ? context : structuredClone(context);

		for (const stage of stages) {
			try {
				const result = await stage(currentContext);

				if (result.ok) {
					currentContext =
						mutate === true ? Object.assign(currentContext, result.value) : result.value;
				} else {
					return result;
				}
			} catch (error) {
				return failure(error);
			}
		}

		return success(currentContext);
	}) satisfies Compose;

export default compose;
