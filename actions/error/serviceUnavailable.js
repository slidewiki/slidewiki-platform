import ErrorStore from '../../stores/ServiceErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export default function serviceUnavailable(context, payload, done) {
    console.log('From service unavailable:', payload);
    const error = fumble.http.serviceUnavailable();
    ErrorsList.SERVICE_UNAVAILABLE.statusCode = error.statusCode;
    ErrorsList.SERVICE_UNAVAILABLE.statusText = error.message;
    ErrorsList.SERVICE_UNAVAILABLE.additionalInfo = payload.err;
    context.dispatch('SERVICE_ERROR', ErrorsList.SERVICE_UNAVAILABLE);
    done(error);
}
