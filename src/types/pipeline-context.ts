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

export type { PipelineContext };
