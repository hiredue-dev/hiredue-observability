const Transport = require("winston-transport");
const fs = require("fs");

class WatcherTransport extends Transport {
	constructor(opts = {}) {
		super(opts);
		this.file = opts.PATH;
		this.maxSize = opts.SIZE ?? 2 * 1024 * 1024; // 2MB
	}

	log(info, callback) {
		setImmediate(() => this.emit("logged", info));

		const line = JSON.stringify(info) + "\n";

		try {
			if (fs.existsSync(this.file)) {
				const { size } = fs.statSync(this.file);
				if (size > this.maxSize) {
					fs.truncateSync(this.file, 0); // reset
				}
			}

			fs.appendFileSync(this.file, line);
		} catch (e) {
			// swallow errors to avoid recursive logging
		}

		callback();
	}
}

module.exports = WatcherTransport;
