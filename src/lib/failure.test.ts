import { describe, expect, it } from 'vitest';
import failure, { PipelineError } from './failure.js';

describe('failure', () => {
	it('should return a Result with ok set to false and the provided error', () => {
		const error = new PipelineError('Test error');
		const result = failure(error);

		expect(result.ok).toBe(false);
		expect(result.ok ? result.value : result.error).toBe(error);
	});

	it('should work with different error types', () => {
		const error = 'String error';
		const result = failure(error);

		expect(result.ok).toBe(false);
		expect(result.ok ? result.value : result.error).toBeInstanceOf(PipelineError);
	});
});
