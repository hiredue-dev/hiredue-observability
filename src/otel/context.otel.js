const api = require('@opentelemetry/api');
const {getTracer, getActiveSpan} = require('./init.otel');

function startTracedExecution(name, fn) {
  const tracer = getTracer();
  return tracer.startActiveSpan(name, async span => {
    try {
      return await fn();
    } finally {
      span.end();
    }
  });
}

function traceExecution(name, fn) {
	const tracer = getTracer();
	return function(...args) {
		return tracer.startActiveSpan(name, (span) => {
			try{
				const result = fn.apply(this, args);
				return result;
			}catch(err){
				// span.recordException(err);
				// span.setStatus({ code: api.SpanStatusCode.ERROR, message: err.message });
				throw err;
			}
			finally{
				span.end()
			}
		});
	}
}
function traceAsyncExecution(name, fn) {
	const tracer = getTracer();
	return async function(...args) {
		return tracer.startActiveSpan(name, async (span) => {
			try{
				const result = await fn.apply(this, args);
				return result;
			}catch(err){
				// span.recordException(err);
				// span.setStatus({ code: api.SpanStatusCode.ERROR, message: err.message });
				throw err;
			}
			finally{
				span.end()
			}
		});
	}
}

function getActiveIds() {
  const span = getActiveSpan();
  if (!span) return {};

  const ctx = span.spanContext();
	const parent = span.parentSpanContext;

  return {
		name:span.name,
    executionId: ctx.traceId,
    operationId: ctx.spanId,
		parentExecutionId: parent?.traceId || null,
		parentOperationId: parent?.spanId || null,
  };
}


module.exports = {
	startTracedExecution,
	traceExecution,
	traceAsyncExecution,
	getActiveIds
}
