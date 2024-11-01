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
interface PipelineContext {
}

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
type Result<T, E = Error> = {
    ok: true;
    value: T;
} | {
    ok: false;
    error: E;
};

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
declare const compose: (...stages: PipelineStage[]) => PipelineStage;

/**
 * Custom error class for pipeline errors.
 */
declare class PipelineError extends Error {
    constructor(message: string);
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
declare const failure: <T>(error: unknown) => Result<T, PipelineError>;

declare const resolve: <T, E>(result: Result<T, E>) => T;

/**
 * Creates a successful result object.
 *
 * This function is used to wrap a value in a `Result` object indicating a successful operation.
 * The resulting object will have the `ok` property set to `true` and the `value` property set to the provided value.
 *
 * @template T - The type of the value being wrapped.
 * @param {T} value - The value to wrap in a successful result.
 * @returns {Result<T>} An object representing a successful result containing the provided value.
 *
 * @example
 * // Creating a successful result with a string value
 * const result = success('Operation completed successfully');
 * console.log(result); // { ok: true, value: 'Operation completed successfully' }
 *
 * @example
 * // Creating a successful result with an object value
 * const result = success({ id: 1, name: 'John Doe' });
 * console.log(result); // { ok: true, value: { id: 1, name: 'John Doe' } }
 */
declare const success: <T>(value: T) => Result<T>;

export { type PipelineContext, type PipelineStage, type Result, compose, failure, resolve, success };
