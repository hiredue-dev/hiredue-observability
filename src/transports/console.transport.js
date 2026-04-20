const Transport = require("winston-transport");

class ConsoleTransport extends Transport {
  constructor(opts = {}) {
    super(opts);
    this.json = opts.JSON ?? true;
    this.colorize = opts.COLORIZE ?? false;
    this.exclude = opts.EXCLUDE || [];
  }

  log(info, callback) {
    setImmediate(() => this.emit("logged", info));

    let output;

    if (this.json) {
      output = JSON.stringify(info, null, 2);
    } else {
      const parts = [];

      for (const key in info) {
        if (this.exclude.includes(key)) continue;
        parts.push(`${key}: ${info[key]}`);
      }

      output = parts.join(" ");
    }

    if (this.colorize) {
      const levelColors = {
        error: "\x1b[31m",
        warn: "\x1b[33m",
        info: "\x1b[32m",
        debug: "\x1b[34m",
      };

      const reset = "\x1b[0m";
      const color = levelColors[info.level] || "";

      output = `${color}${output}${reset}`;
    }

    // Proper console method per level
    switch (info.level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      case "info":
        console.info(output);
        break;
      case "debug":
        console.debug(output);
        break;
      default:
        console.log(output);
    }

    callback();
  }
}

module.exports = ConsoleTransport;
