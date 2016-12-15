import notFoundError from './error/notFoundError';
const clog = require('./log/clog');

export default function loadNotFound(context, payload, done) {
    clog.info(context, payload);
    context.executeAction(notFoundError, payload, done);
    return;
}
