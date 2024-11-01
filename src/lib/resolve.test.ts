import type { Result } from '$types/result.js';
import { describe, expect, it } from 'vitest';
import resolve from './resolve.js';

describe('resolve', () => {
	it('should return the value if result is ok', () => {
		const result: Result<number, Error> = { ok: true, value: 42 };

		expect(resolve(result)).toBe(42);
	});

	it('should throw an error if result is not ok', () => {
		const error = new Error('Something went wrong');
		const result: Result<number, Error> = { ok: false, error };

		expect(() => resolve(result)).toThrow(error);
	});
});
