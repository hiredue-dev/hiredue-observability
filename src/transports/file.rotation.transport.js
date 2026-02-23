const path = require('path');
const fs = require('fs');
const DailyRotateFile = require('winston-daily-rotate-file');

const FileRotationTransport = (CONFIG) =>{
	const transport = new DailyRotateFile({
		dirname: CONFIG.DIR,
		filename: CONFIG.PATH,
		maxSize: CONFIG.SIZE,
		maxFiles: '14d',
		zippedArchive: CONFIG.ZIP_ARCHIVE
	});
	transport.on('archive', (oldFilename, newFilename) => {
		const logPath = oldFilename;
		const info = path.parse(logPath);

		const date = new Date();
		const timestamp = [
			date.getUTCHours(),
			date.getUTCMinutes(),
			date.getUTCSeconds(),
			date.getUTCDate(),
			date.getUTCMonth() + 1,
			date.getUTCFullYear()
		]
			.map(n => String(n).padStart(2, '0'))
			.join('-');

		try {
			const fileName = path.join(info.dir, timestamp);
			const finalPath = fileName + '.log' + info.ext;
			fs.renameSync(oldFilename, finalPath);
			transport.emit('post-archive',{
				originalPath: oldFilename,
				archivedPath: finalPath
			})
		} catch (e) {
			// logger object avoided o prevent recursive logging
			console.error('Error during log file archiving:', e);
		}
	});
return transport
}
module.exports = FileRotationTransport;
