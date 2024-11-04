import type { PipelineContext } from '$types/pipeline-context.js';
import type { PipelineStage } from '$types/pipeline-stage.js';
import { describe, expect, it } from 'vitest';
import compose from './compose.js';

describe('compose', () => {
	type Context = Partial<{ stage1: boolean; stage2: boolean }>;

	const stage1: PipelineStage<Context> = async (context) => ({
		ok: true,
		value: { ...context, stage1: true }
	});

	const stage2: PipelineStage<Context> = async (context) => ({
		ok: true,
		value: { ...context, stage2: true }
	});

	it('should process all stages and return the final context if all stages succeed', async () => {
		const pipeline = compose([stage1, stage2]);

		const initialContext = {};

		const result = await pipeline(initialContext);

		if (result.ok) {
			expect(result.value).toEqual({ stage1: true, stage2: true });
		} else {
			throw new Error('Expected result to be a success');
		}
	});

	it('should return the error result if a stage fails', async () => {
		const stage2: PipelineStage = async () => ({
			ok: false,
			error: new Error('Stage 2 failed')
		});

		const pipeline = compose([stage1, stage2]);

		const initialContext: PipelineContext = {};

		const result = await pipeline(initialContext);

		if (result.ok) {
			throw new Error('Expected result to be a failure');
		} else {
			expect(result.error).toEqual(new Error('Stage 2 failed'));
		}
	});

	it('should catch and return an error if a stage throws an exception', async () => {
		const stage2: PipelineStage = async () => {
			throw new Error('Stage 2 exception');
		};

		const pipeline = compose([stage1, stage2]);

		const initialContext: PipelineContext = {};

		const result = await pipeline(initialContext);

		if (result.ok) {
			throw new Error('Expected result to be a failure');
		} else {
			expect(result.error).toEqual(new Error('Stage 2 exception'));
		}
	});
});
