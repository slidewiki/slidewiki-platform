const winston = require('winston');
const fs = require('fs');
const logDir = 'logs';
const obj = {};

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// winston.setLevels(winston.config.npm.levels);
//winston.setLevels(winston.config.syslog.levels);
//winston.addColors(winston.config.npm.colors);

if (!obj.log) {
    obj.log = new (winston.Logger)({
        transports: [
            // Console transport
            new (winston.transports.Console)({
                timestamp: true,
                colorize: true,
                level: 'debug',
                handleExceptions: true,
                humanReadableUnhandledException: true
            }),
            // file transport
            new (require('winston-daily-rotate-file'))({
                label: 'slidewiki-platform',
                filename: `${logDir}/-platform.log`,
                timestamp: true,
                datePattern: 'yyyy-MM-dd',
                prepend: true,
                level: 'debug',
                handleExceptions: true,
                humanReadableUnhandledException: true,
                maxsize: 1024 * 1024 * 10, // in bytes, 10 MB
                json: true,
            }),
        ],
        exitOnError: false
    });
    
    obj.log.setLevels(winston.config.syslog.levels);
}

module.exports = obj;
