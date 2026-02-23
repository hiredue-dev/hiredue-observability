const winston = require("winston");
const {traceContextFormat} = require("./formats");
const { buildTransports } = require("./helper/transport.builder");


let logger = null;
let transports = null;

function initLogger(LOG_CONFIG){
	if (logger) {
		console.warn("Logger already initialized. Returning existing instance.");
		return logger;
	}

	transports = buildTransports(LOG_CONFIG.TRANSPORTS);
	logger = winston.createLogger({
		level: LOG_CONFIG.LEVEL,
		format: winston.format.combine(
			traceContextFormat(),
			winston.format.timestamp(),
			winston.format.json()
		),
		transports: Object.values(transports)
	})
	console.log("Logger initialized");
	return logger
};


function attachHooksOnTransport(transportName, hooks = {}){
	if (!transports || !transports[transportName]) {
		console.warn(`Transport ${transportName} not found. Cannot attach hooks.`);
		return;
	}
	const transport = transports[transportName];
	for(const event of Object.keys(hooks)){
		transport.on(event, hooks[event]);
	}
}

const logFunction = (level, message, extra = {}) =>{
	logger.log({
		level,
		message,
		...extra
	});
}

module.exports = {
	initLogger,
	attachHooksOnTransport,
	logFunction
}
