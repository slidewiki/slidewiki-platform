import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export default function gatewayTimeoutError(context, payload, done) {
    const error = fumble.http.badRequest();
    ErrorsList.GATEWAY_TIMEOUT_ERROR.statusCode = error.statusCode;
    ErrorsList.GATEWAY_TIMEOUT_ERROR.statusText = error.message;
    context.dispatch('GATEWAY_TIMEOUT_ERROR', ErrorsList.GATEWAY_TIMEOUT_ERROR);
    done(error);
}
