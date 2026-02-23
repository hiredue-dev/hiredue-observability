# Observability 


# usage
## install dependencies
```bash
npm install @arnob-b/observability
```

## initializing observability
```javascript
const { Observability } = require("@arnob-b/observability");
Observability.init(OBSERVABILITY_CONFIG);
```

### Sample configuration 
```javascript
const path = require('path');
const fs = require('fs');
const LOG_ROTATION_SIZE = '1K'
const LOG_WATCHER_FILE_SIZE = '1K'

const LOG_DIR = "server_logs";
if (!fs.existsSync(LOG_DIR)){
	fs.mkdirSync(LOG_DIR);
}
const LOG_PATH=path.join(LOG_DIR,'main.%DATE%.log');
const WATCH_FILE_PATH =path.join(LOG_DIR,'watcher.log');


const OBSERVABILITY_CONFIG = {
	LOG:{
		LEVEL: 'debug',
		TRANSPORTS: {
			CONSOLE: {
				NAME: "console-transport",
				ENABLED: true,
			},
			FILE: {
				NAME: "file-rotation-transport",
				ENABLED: true,
				PATH : LOG_PATH,
				DIR : LOG_DIR,
				SIZE: LOG_ROTATION_SIZE,
				ZIP_ARCHIVE: true,
			},
			STREAM: {
				NAME: "stream-transport",
				ENABLED: false,
				STREAM_URL: 'http://localhost:3000/logs',
				HTTP_METHOD: 'POST',
			},
			WATCHER: {
				NAME: "watcher-transport",
				ENABLED: true,
				PATH : WATCH_FILE_PATH,
				SIZE: LOG_WATCHER_FILE_SIZE,
			}
		}
	},
	OTEL: {
		SERVICE_NAME: 'electron-logger-service',
		SERVICE_VERSION: 'http://localhost:4317',
		INSTRUMENTS: {
			HTTP: {
				ENABLED: false,
			},
			UNDICI: {
				ENABLED: true,
			},
			EXPRESS: {
				ENABLED: false,
			}
		}
	},
}
module.exports = OBSERVABILITY_CONFIG;
```

### predefined logger object from factory
```javascript
const {logFunction} = require("@arnob-b/observability")
const {normalizeData} = require("./helper.cjs")

const log  = {
		info: (msg, data = null) => logFunction('info', msg, {process:'main', data:normalizeData(data)}),
		error: (msg, data = null) => logFunction('warn', msg, {process:'main', data:normalizeData(data)}),
		debug: (msg, data = null) => logFunction('debug', msg, {process:'main', data:normalizeData(data)}),
		warn: (msg, data = null) => logFunction('warn', msg, {process:'main', data:normalizeData(data)}),

		renderer: {
			info: (msg, data) => logFunction('info', msg, {process:'renderer', data:normalizeData(data)}),
			error: (msg, data) => logFunction('error', msg, {process:'renderer', data:normalizeData(data)}),
			warn: (msg, data) => logFunction('warn', msg, {process:'renderer', data:normalizeData(data)}),
			debug: (msg, data) => logFunction('debug', msg, {process:'renderer', data:normalizeData(data)}),
		}
} 

module.exports = log;
```

### adding hooks for events emmited by tranports

```javascript
const logger = Observability.getLogger("electron-application");
attachHooksOnTransport("file-rotation-transport", {
	'archive': (oldFilename, newFilename) => {
		logger.info(`Log file rotated: ${oldFilename} -> ${newFilename}`);
	}
})
```

## using tracers
```javascript
const {startTracedExecution, traceExecution, traceAsyncExecution} = require("@arnob-b/observability");

startTracedExecution("main_execution", async () => {
	logger.debug("Starting main execution block");
	startTracedExecution("nested_execution", async () => {
		logger.debug("Starting main execution block");
	})
});

const asyncFunc = traceAsyncExecution("async_execution", async () => {
    logger.debug("Starting async execution block");
    await new Promise(resolve => setTimeout(resolve, 1000));
    logger.debug("Finished async execution block");
});
const nonAsyncFunc = traceExecution("async_execution", async () => {
    logger.debug("Starting execution block");
    logger.debug("Finished execution block");
});

asyncFunc();
nonAsyncFunc();
```


# architechture

