const winston = require('winston');
const fs = require('fs');
const logDir = 'logs';
const obj = {};

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

winston.setLevels(winston.config.syslog.levels);
winston.addColors(winston.config.npm.colors);

if (!obj.log) {
    obj.log = new (winston.Logger)({
        transports: [
            // file transport
            new (require('winston-daily-rotate-file'))({
                label: 'slidewiki-platform',
                filename: `${logDir}/-platform.log`,
                timestamp: true,
                datePattern: 'yyyy-MM-dd',
                prepend: true,
                level: 'warning',
                handleExceptions: true,
                humanReadableUnhandledException: true,
                maxsize: 1024 * 1024 * 10, // in bytes, 10 MB
                json: true,
            }),
        ],
        exitOnError: false
    });
}

module.exports = obj;
