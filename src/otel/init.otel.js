const { NodeSDK } = require('@opentelemetry/sdk-node');
const { trace } = require('@opentelemetry/api');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} = require('@opentelemetry/semantic-conventions');
const { buildInstrumentations } = require('../helper/instrument.builder.otel');


let sdk;
let tracer;

function initOtel(CONFIG) {
  if (sdk) return;

	const instruments = buildInstrumentations(CONFIG.INSTRUMENTS);
  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: CONFIG.SERVICE_NAME,
      [ATTR_SERVICE_VERSION]: CONFIG.SERVICE_VERSION,
    }),
		instrumentations:instruments
  });

  sdk.start();
	console.log("Otel initialized for service:", CONFIG.SERVICE_NAME);
  tracer = trace.getTracer(CONFIG.SERVICE_NAME);
}

function shutdownOtel() {
	if (sdk) { sdk.shutdown(); }
}

function getTracer() {
  if (!tracer) {
    throw new Error("Otel not initialized");
  }
  return tracer;
}

function getActiveSpan(){
	return trace.getActiveSpan()
}


module.exports = {initOtel, getTracer , getActiveSpan, shutdownOtel};
