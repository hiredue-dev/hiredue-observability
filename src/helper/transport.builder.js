const winston = require('winston')
const { WatcherTransport, StreamTransport, FileRotationTransport } = require("../transports");
const ConsoleTransport = require('../transports/console.transport');


function buildTransports(CONFIG = {}) {
  const list = {};

	if (CONFIG.CONSOLE) {
		list[CONFIG.CONSOLE.NAME] = new ConsoleTransport(CONFIG.CONSOLE);
	}
  else{
    list['default-console'] = new winston.transports.Console()
  }
	if (CONFIG.FILE && CONFIG.FILE.ENABLED) {
		list[CONFIG.FILE.NAME] = FileRotationTransport(CONFIG.FILE)
	}
	if (CONFIG.STREAM && CONFIG.STREAM.ENABLED) {
		list[CONFIG.STREAM.NAME] = new StreamTransport(CONFIG.STREAM);
	}

  return list;
}


module.exports = { buildTransports };
