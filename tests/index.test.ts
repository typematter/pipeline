import { compose, type PipelineStage, resolve } from '@typematter/pipeline';
import { describe, expect, it } from 'vitest';

describe('compose', () => {
	const stage1: PipelineStage = async (context) => ({
		ok: true,
		value: { ...context, stage1: true }
	});

	const stage2: PipelineStage = async (context) => ({
		ok: true,
		value: { ...context, stage2: true }
	});

	const pipeline = compose([stage1, stage2]);

	it('should execute all stages', async () => {
		const context = await pipeline({});

		expect(context).toEqual({ ok: true, value: { stage1: true, stage2: true } });
	});
});

describe('resolve', () => {
	it('should return the value if result is ok', () => {
		const result = { ok: true as const, value: 42 };

		expect(resolve(result)).toBe(42);
	});

	it('should throw an error if result is not ok', () => {
		const error = new Error('Something went wrong');
		const result = { ok: false as const, error };

		expect(() => resolve(result)).toThrow(error);
	});
});
