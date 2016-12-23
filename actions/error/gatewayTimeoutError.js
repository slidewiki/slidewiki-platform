import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
const clog = require('../log/clog');

export default function gatewayTimeoutError(context, payload, done) {
    clog.error(context, payload, 'Gateway timeout');
    const error = fumble.http.badRequest();
    ErrorsList.GATEWAY_TIMEOUT_ERROR.statusCode = error.statusCode;
    ErrorsList.GATEWAY_TIMEOUT_ERROR.statusText = error.message;
    context.dispatch('GATEWAY_TIMEOUT_ERROR', ErrorsList.GATEWAY_TIMEOUT_ERROR);
    done(error);
}
