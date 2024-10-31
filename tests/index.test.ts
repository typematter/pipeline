import { compose, PipelineStage } from '@typematter/pipeline';
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

	const pipeline = compose(stage1, stage2);

	it('should execute all stages', async () => {
		const context = await pipeline();

		expect(context).toEqual({ ok: true, value: { stage1: true, stage2: true } });
	});
});
