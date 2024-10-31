// src/lib/failure.ts
var PipelineError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "PipelineError";
  }
};
var failure = (error) => ({
  ok: false,
  error: error instanceof PipelineError ? error : new PipelineError(error instanceof Error ? error.message : String(error))
});

// src/lib/success.ts
var success = (value) => ({
  ok: true,
  value
});
var success_default = success;

// src/lib/compose.ts
var compose = (...stages) => async (context = {}) => {
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
  return success_default(currentContext);
};
var compose_default = compose;

export { compose_default as compose, failure, success_default as success };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map