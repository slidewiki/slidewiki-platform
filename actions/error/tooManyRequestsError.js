import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
const log = require('../log/clog');

export default function tooManyRequestsError(context, payload, done) {
    log.error(context, payload, 'Too many requests');
    const error = fumble.http.tooManyRequests();
    ErrorsList.TOO_MANY_REQUESTS_ERROR.statusCode = error.statusCode;
    ErrorsList.TOO_MANY_REQUESTS_ERROR.statusText = error.message;
    context.dispatch('TOO_MANY_REQUESTS_ERROR', ErrorsList.TOO_MANY_REQUESTS_ERROR);
    done(error);
}
