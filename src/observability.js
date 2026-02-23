const {initOtel} = require("./otel");
const {initLogger} = require("./logger");
class Observability {
	constructor() {
		if (Observability.instance) {
			console.warn("Observability instance already exists. Returning existing instance.");
			return Observability.instance;
		}

		this.initialized = false;
		Observability.instance = this;
	}
	async init(config){
		if (this.initialized) {
			console.warn("Observability already initialized");
			return;
		}
		initOtel(config.OTEL);
		this.logger = initLogger(config.LOG);

		this.initialized = true;
	}
}


module.exports = new Observability;
