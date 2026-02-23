const { traceExecution, traceAsyncExecution, startTracedExecution } = require("./otel");
const {attachHooksOnTransport, logFunction} = require("./logger");
const Observability = require("./observability");


module.exports = {
	Observability,
	logFunction,
	traceExecution,
	traceAsyncExecution,
	startTracedExecution,
	attachHooksOnTransport
}
