const winston = require('winston');
const {getActiveIds} = require('./../otel');

const traceContextFormat = winston.format((info) => {
  const context = getActiveIds();
	info.context_name = context.name ?? '';
	info.context_execution_id = context.executionId ?? '';
	info.context_operation_id = context.operationId ?? '';
	info.context_parent_operation_id = context.parentOperationId ?? '';
  return info;
});

module.exports = {traceContextFormat};
