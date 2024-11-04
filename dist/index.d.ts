/**
 * Represents the context object passed through a pipeline's stages.
 * This is a flexible record type that can store any key-value pairs needed
 * during pipeline execution.
 *
 * @example
 * ```typescript
 * // Example pipeline context with user and processing data
 * type UserProcessingContext = PipelineContext & {
 *   userId: string;
 *   processingStartTime: Date;
 *   validationResults?: boolean;
 * };
 * ```
 */
type PipelineContext = Record<string, unknown>;

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
type Result<T, E = Error> = {
    ok: true;
    value: T;
} | {
    ok: false;
    error: E;
};

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
type PipelineStage<T extends PipelineContext = PipelineContext> = (context: T) => Promise<Result<T>>;

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
declare const compose: <T extends PipelineContext = PipelineContext>(stages: PipelineStage<T>[], { mutate }?: ComposeOptions | undefined) => (context: T) => Promise<{
    ok: false;
    error: Error;
} | {
    ok: true;
    value: T;
}>;

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
declare class PipelineError extends Error {
    constructor(message: string);
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
declare const failure: <T>(error: unknown) => Result<T, PipelineError>;

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
declare const resolve: <T, E>(result: Result<T, E>) => T;

/**
 * Creates a successful `Result` object containing a value.
 * This is a utility function to create the success case of a `Result` type in
 * a more concise and type-safe way.
 *
 * @template T - The type of the success value
 * @param value - The value to wrap in a successful `Result` object
 * @returns A `Result` object with `ok: true` and the provided value
 *
 * @example
 * // Basic usage
 * const numberResult = success(42);
 * // Type: Result<number> = { ok: true, value: 42 }
 *
 * @example
 * // With complex types
 * interface UserData {
 *   id: string;
 *   name: string;
 * }
 *
 * const userData = success({
 *   id: "42",
 *   name: "Alice"
 * });
 * // Type: Result<UserData>
 *
 * @example
 * // Using in async functions
 * async function fetchUser(id: string): Promise<Result<UserData>> {
 *   try {
 *     const user = await db.users.find(id);
 *     return success(user);
 *   } catch (error) {
 *     return failure(error);
 *   }
 * }
 *
 * @see {@link Result} - The Result type this function creates
 */
declare const success: <T>(value: T) => Result<T>;

export { type PipelineContext, type PipelineStage, type Result, compose, failure, resolve, success };
