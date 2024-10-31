import type { PipelineContext } from '$types/pipeline-context.js';
import type { PipelineStage } from '$types/pipeline-stage.js';
import { describe, expect, it } from 'vitest';
import compose from './compose.js';

describe('compose', () => {
	it('should process all stages and return the final context if all stages succeed', async () => {
		const stage1: PipelineStage = async (context) => ({
			ok: true,
			value: { ...context, stage1: true }
		});

		const stage2: PipelineStage = async (context) => ({
			ok: true,
			value: { ...context, stage2: true }
		});

		const pipeline = compose(stage1, stage2);

		const initialContext: PipelineContext = {};

		const result = await pipeline(initialContext);

		expect(result.ok).toBe(true);
		expect(result.ok ? result.value : null).toEqual({ stage1: true, stage2: true });
	});

	it('should return the error result if a stage fails', async () => {
		const stage1: PipelineStage = async (context) => ({
			ok: true,
			value: { ...context, stage1: true }
		});

		const stage2: PipelineStage = async () => ({
			ok: false,
			error: new Error('Stage 2 failed')
		});

		const pipeline = compose(stage1, stage2);

		const initialContext: PipelineContext = {};

		const result = await pipeline(initialContext);

		expect(result.ok).toBe(false);
		expect(result.ok ? null : result.error).toEqual(new Error('Stage 2 failed'));
	});

	it('should catch and return an error if a stage throws an exception', async () => {
		const stage1: PipelineStage = async (context) => ({
			ok: true,
			value: { ...context, stage1: true }
		});

		const stage2: PipelineStage = async () => {
			throw new Error('Stage 2 exception');
		};

		const pipeline = compose(stage1, stage2);

		const initialContext: PipelineContext = {};

		const result = await pipeline(initialContext);

		expect(result.ok).toBe(false);
		expect(result.ok ? null : result.error).toEqual(new Error('Stage 2 exception'));
	});
});
