import type { Result } from '$types/result.js';
import { describe, expect, it } from 'vitest';
import success from './success.js';

describe('success', () => {
	it('should return a `Result` with `ok` set to `true` and the provided value', () => {
		const value = 'Test value';
		const result: Result<string> = success(value);

		if (result.ok) {
			expect(result.value).toBe(value);
		} else {
			throw new Error('Expected result to be a success');
		}
	});

	for (const value of [undefined, null, 0, false, '']) {
		it(`should work when provided value is ${JSON.stringify(value)}`, () => {
			const result: Result<typeof value> = success(value);

			if (result.ok) {
				expect(result.value).toBe(value);
			} else {
				throw new Error('Expected result to be a success');
			}
		});
	}

	it('should work when provided value is an array', () => {
		const value = [1, 2, 3];
		const result: Result<typeof value> = success(value);

		if (result.ok) {
			expect(result.value).toBe(value);
		} else {
			throw new Error('Expected result to be a success');
		}
	});

	it('should work when provided value is an object', () => {
		const value = { key: 'value' };
		const result: Result<typeof value> = success(value);

		if (result.ok) {
			expect(result.value).toBe(value);
		} else {
			throw new Error('Expected result to be a success');
		}
	});
});
