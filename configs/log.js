const bunyan = require('bunyan');
const fs = require('fs');
const logDir = 'logs'; // Or read from a configuration

if (!fs.existsSync(logDir)) {
    fs.mkdirSync( logDir );
}

function reqSerializer(req) {
    return {
        method: req.method,
        url: req.url,
        //headers: req.headers // enable it if you need request headers in your log message
    };
}

const logger = bunyan.createLogger({
    name: 'slidewiki-platform',
    streams: [
        {
            stream: process.stderr,
            level: 'debug',
        },
        {
            type: 'rotating-file',
            period: 'daily',
            path: logDir + '/platform.log',
            level: 'warn',
        }

    ],
    serializers: {
        req: reqSerializer, // using custom serializer else it throws a lot of stuff not required.
    }

});

export default logger;
