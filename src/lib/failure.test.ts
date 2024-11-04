import { describe, expect, it } from 'vitest';
import failure, { PipelineError } from './failure.js';

describe('failure', () => {
	it('should return a `Result` with `ok` set to `false` and the provided error', () => {
		const error = new PipelineError('Test error');
		const result = failure(error);

		if (result.ok) {
			throw new Error('Expected result to be an error');
		} else {
			expect(result.error).toBe(error);
		}
	});

	for (const error of [undefined, null, 0, false, '']) {
		it(`should work when provided error is ${JSON.stringify(error)}`, () => {
			const result = failure(error);

			if (result.ok) {
				throw new Error('Expected result to be an error');
			} else {
				expect(result.error).toBeInstanceOf(PipelineError);
			}
		});
	}

	it('should work when provided error is an `Error`', () => {
		const error = new Error('Test error');
		const result = failure(error);

		if (result.ok) {
			throw new Error('Expected result to be an error');
		} else {
			expect(result.error).toBeInstanceOf(PipelineError);
		}
	});
});
