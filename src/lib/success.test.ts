import type { Result } from '$types/result.js';
import { describe, expect, it } from 'vitest';
import success from './success.js';

describe('success', () => {
	it('should return a Result with ok set to true and the provided value', () => {
		const value = 'Test value';
		const result: Result<string> = success(value);

		expect(result.ok).toBe(true);
		expect(result.ok ? result.value : null).toBe(value);
	});

	it('should work with different value types', () => {
		const value = { key: 'value' };
		const result: Result<{ key: string }> = success(value);

		expect(result.ok).toBe(true);
		expect(result.ok ? result.value : null).toBe(value);
	});
});
