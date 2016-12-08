import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
import { logger, breadcrumb} from '../../configs/log';

export default function gatewayTimeoutError(context, payload, done) {
    logger.error('Gateway Timeout', {reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    const error = fumble.http.badRequest();
    ErrorsList.GATEWAY_TIMEOUT_ERROR.statusCode = error.statusCode;
    ErrorsList.GATEWAY_TIMEOUT_ERROR.statusText = error.message;
    context.dispatch('GATEWAY_TIMEOUT_ERROR', ErrorsList.GATEWAY_TIMEOUT_ERROR);
    done(error);
}
