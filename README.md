# Pipeline

[![Node.js Package](https://github.com/typematter/pipeline/actions/workflows/release-package.yml/badge.svg)](https://github.com/typematter/pipeline/actions/workflows/release-package.yml)

A lightweight and flexible pipeline library for composing asynchronous operations in TypeScript.

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- Compose multiple asynchronous operations into a single pipeline
- Handle success and failure results consistently
- Extendable context object passed through each stage of the pipeline
- Lightweight and easy to use

## Installation

To install the library, use `pnpm`:

```bash
pnpm install typematter/pipeline
```

NPM package coming soon!

## Usage

Here's a basic example of how to use the pipeline library:

```typescript
import { compose, success, failure, PipelineStage, PipelineContext } from '@typematter/pipeline';

type Context = { step1?: boolean; step2?: boolean };

// Define some pipeline stages
const stage1: PipelineStage<Context> = async (context) => success({ ...context, step1: true });

const stage2: PipelineStage<Context> = async (context) => success({ ...context, step2: true });

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

## API Reference

### Types

#### `Result<T, E = Error>`

Represents the result of an operation that can either succeed or fail.

```typescript
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
```

#### `PipelineStage`

A function that represents a stage in a pipeline. Takes a context object and returns a `Promise` of a `Result`.

```typescript
type PipelineStage<T extends PipelineContext = PipelineContext> = (
	context: T
) => Promise<Result<T>>;
```

#### `PipelineContext`

The base context object passed through each stage of the pipeline. Can be extended with custom properties.

```typescript
type PipelineContext = Record<string, unknown>;
```

### Functions

#### `success<T>(value: T): Result<T>`

Creates a successful result object.

```typescript
const result = success({ data: 'example' });
// { ok: true, value: { data: 'example' } }
```

#### `failure<T>(error: unknown): Result<T, PipelineError>`

Creates a failure result object.

```typescript
const result = failure(new Error('Something went wrong'));
// { ok: false, error: PipelineError('Something went wrong') }
```

#### `compose(...stages: PipelineStage[]): PipelineStage`

Composes multiple pipeline stages into a single pipeline function.

```typescript
const pipeline = compose(stage1, stage2, stage3);
const result = await pipeline(initialContext);
```

### Examples

#### Error Handling

```typescript
const errorStage: PipelineStage = async (context) => {
	try {
		// Some operation that might fail
		return success({ ...context, data: 'processed' });
	} catch (error) {
		return failure(error);
	}
};
```

#### Context Modification

```typescript
const addDataStage: PipelineStage = async (context) => {
	const newContext = {
		...context,
		timestamp: Date.now(),
		data: 'new data'
	};
	return success(newContext);
};
```

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, feel free to open an issue or contact the maintainers.
