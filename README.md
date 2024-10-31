[![Node.js Package](https://github.com/typematter/pipeline/actions/workflows/release-package.yml/badge.svg)](https://github.com/typematter/pipeline/actions/workflows/release-package.yml)

# Pipeline

A lightweight and flexible pipeline library for composing asynchronous operations in TypeScript.

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API documentation](#api-documentation)
  - [Result](#result)
  - [PipelineStage](#pipelinestage)
  - [PipelineContext](#pipelinecontext)
  - [success](#success)
  - [failure](#failure)
  - [compose](#compose)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- Compose multiple asynchronous operations into a single pipeline.
- Handle success and failure results consistently.
- Extendable context object passed through each stage of the pipeline.
- Lightweight and easy to use.

## Installation

To install the library, use npm or yarn:

```bash
npm install @typematter/pipeline
# or
yarn add @typematter/pipeline
```

## Usage

Here's a basic example of how to use the pipeline library:

```typescript
import { compose, success, failure, PipelineStage, PipelineContext } from '@typematter/pipeline';

// Define some pipeline stages
const stage1: PipelineStage = async (context) => success({ ...context, step1: true });
const stage2: PipelineStage = async (context) => success({ ...context, step2: true });

// Compose the stages into a single pipeline
const pipeline = compose(stage1, stage2);

// Execute the pipeline
const result = await pipeline({});
if (result.ok) {
	console.log(result.value); // { step1: true, step2: true }
} else {
	console.error(result.error);
}
```

## API documentation

### Result

Represents the result of an operation that can either succeed or fail.

```typescript
type Result<T, E = Error> =
	| {
			ok: true;
			value: T;
	  }
	| {
			ok: false;
			error: E;
	  };
```

### PipelineStage

Represents a stage in a pipeline.

```typescript
type PipelineStage = (context?: PipelineContext) => Promise<Result<PipelineContext>>;
```

### PipelineContext

Represents the context object passed through each stage of the pipeline.

```typescript
interface PipelineContext {}
```

### success

Creates a successful result object.

```typescript
const success = <T>(value: T): Result<T> => ({
	ok: true,
	value
});
```

### failure

Creates a failure result object.

```typescript
const failure = <T>(error: unknown): Result<T, PipelineError> => ({
	ok: false,
	error:
		error instanceof PipelineError
			? error
			: new PipelineError(error instanceof Error ? error.message : String(error))
});
```

### compose

Composes multiple pipeline stages into a single pipeline function.

```typescript
const compose: (...stages: PipelineStage[]) => PipelineStage =
	(...stages) =>
	async (context: PipelineContext = {}): Promise<Result<PipelineContext>> => {
		let currentContext = context;

		for (const stage of stages) {
			try {
				const result = await stage(currentContext);

				if (result.ok) {
					currentContext = result.value;
				} else {
					return result;
				}
			} catch (error) {
				return failure(error);
			}
		}

		return success(currentContext);
	};
```

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, feel free to open an issue or contact the maintainers.
