import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
import { logger, breadcrumb} from '../../configs/log';

export default function tooManyRequestsError(context, payload, done) {
    logger.error('Too many requests.', {reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    const error = fumble.http.tooManyRequests();
    ErrorsList.TOO_MANY_REQUESTS_ERROR.statusCode = error.statusCode;
    ErrorsList.TOO_MANY_REQUESTS_ERROR.statusText = error.message;
    context.dispatch('TOO_MANY_REQUESTS_ERROR', ErrorsList.TOO_MANY_REQUESTS_ERROR);
    done(error);
}
