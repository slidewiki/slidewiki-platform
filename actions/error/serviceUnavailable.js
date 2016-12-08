import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
import { logger, breadcrumb} from '../../configs/log';

export default function serviceUnavailable(context, payload, done) {
    const error = fumble.http.serviceUnavailable();
    ErrorsList.SERVICE_UNAVAILABLE.statusCode = error.statusCode;
    ErrorsList.SERVICE_UNAVAILABLE.statusText = error.message;
    ErrorsList.SERVICE_UNAVAILABLE.breadcrumb = breadcrumb(context.stack);
    logger.error({reqId: payload.navigate.reqId, err:ErrorsList.SERVICE_UNAVAILABLE});
    context.dispatch('SERVICE_UNAVAILABLE', ErrorsList.SERVICE_UNAVAILABLE);
    done(error);
}
