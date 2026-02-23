const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { ExpressInstrumentation } = require("@opentelemetry/instrumentation-express");

const { UndiciInstrumentation } = require('@opentelemetry/instrumentation-undici');


function buildInstrumentations(INSTRUMENT_CONFIG = {}) {
  const list = [];

	if (INSTRUMENT_CONFIG.HTTP) {
		list.push(new HttpInstrumentation());
	}
	if (INSTRUMENT_CONFIG.EXPRESS) {
		list.push(new ExpressInstrumentation());
	}
	if (INSTRUMENT_CONFIG.UNDICI) {
		list.push(new UndiciInstrumentation());
	}

  return list;
}


module.exports = { buildInstrumentations };
