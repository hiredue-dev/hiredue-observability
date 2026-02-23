const { initOtel, getTracer , getActiveSpan, shutdownOtel } = require("./init.otel");
const { startTracedExecution, traceExecution, traceAsyncExecution, getActiveIds } = require("./context.otel");

module.exports = {
	initOtel, getTracer , getActiveSpan, shutdownOtel,
	startTracedExecution,
	traceExecution,
	traceAsyncExecution,
	getActiveIds
}
