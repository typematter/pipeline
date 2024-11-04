import { describe, expect, it } from 'vitest';
import resolve from './resolve.js';

describe('resolve', () => {
	it('should return the value if `ok` is `true`', () => {
		const result = { ok: true as const, value: 42 };

		expect(resolve(result)).toBe(42);
	});

	it('should throw an error if `ok` is `false`', () => {
		const error = new Error('Something went wrong');
		const result = { ok: false as const, error };

		expect(() => resolve(result)).toThrow(error);
	});
});
