const winston = require('winston')
const { WatcherTransport, StreamTransport, FileRotationTransport } = require("../transports");


function buildTransports(CONFIG = {}) {
  const list = {};

	if (CONFIG.CONSOLE && CONFIG.CONSOLE.ENABLED) {
		list[CONFIG.CONSOLE.NAME] = new winston.transports.Console(CONFIG.CONSOLE);
	}
	if (CONFIG.WATCHER && CONFIG.WATCHER.ENABLED) {
		list[CONFIG.WATCHER.NAME] = new WatcherTransport(CONFIG.WATCHER);
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
