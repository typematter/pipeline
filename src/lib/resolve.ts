import type { Result } from '$types/result.js';

const resolve: <T, E>(result: Result<T, E>) => T = (result) => {
	if (result.ok) {
		return result.value;
	} else {
		throw result.error;
	}
};

export default resolve;
