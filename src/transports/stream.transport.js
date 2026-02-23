const Transport = require("winston-transport");
const fs = require("fs");

class StreamTransport extends Transport {
	constructor(opts = {}) {
		super(opts);
		this.url = opts.URL;
	}

	log(info, callback) {
		setImmediate(() => this.emit("logged", info));

		try {
			fetch(this.url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(info),
			})
		} catch (e) {
			// swallow errors to avoid recursive logging
			console.error("Failed to stream logs", e);[]
		}

		callback();
	}
}

module.exports = StreamTransport;
