import serviceUnavailable from './serviceUnavailable';
import notFoundError from './notFoundError';
const log = require('../log/clog');

export default function serviceResponseErrorHandling(context, err, done) {
    log.error(context,  'Error caught in service execution.');
    if (err.statusCode === 404)
        context.executeAction(notFoundError, '', done);
    else if ([501, 502, 503, 504].includes(err.statusCode))
        context.executeAction(serviceUnavailable, '', done);
    done();
}
