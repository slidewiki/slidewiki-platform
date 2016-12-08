const winston = require('winston');
const fs = require('fs');
const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

winston.setLevels(winston.config.npm.levels);
winston.addColors(winston.config.npm.colors);

function breadcrumb(stack) {
    let navStack = stack.slice(); // we don't want to modify original stack by mistake.
    //navStack.shift();
    let navString = '';
    for (let i of navStack) {
        navString += ' -> ' + i;
    }
    return navString.substr(4);
}

const logger = new (winston.Logger)({
    transports: [
        // Console transport
        new (winston.transports.Console)({
            timestamp: true,
            colorize: true,
            level: 'debug',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
        }),
        // file transport
        new (winston.transports.File)({
            filename: `${logDir}/platform.log`,
            timestamp: true,
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

export { logger, breadcrumb };
