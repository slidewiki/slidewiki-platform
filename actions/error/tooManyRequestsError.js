import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export default function tooManyRequestsError(context, payload, done) {
    const error = fumble.http.tooManyRequests();
    ErrorsList.TOO_MANY_REQUESTS_ERROR.statusCode = error.statusCode;
    ErrorsList.TOO_MANY_REQUESTS_ERROR.statusText = error.message;
    context.dispatch('TOO_MANY_REQUESTS_ERROR', ErrorsList.TOO_MANY_REQUESTS_ERROR);
    done(error);
}
