import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export default function serviceUnavailable(context, payload, done) {
    const error = fumble.http.serviceUnavailable();
    ErrorsList.SERVICE_UNAVAILABLE.statusCode = error.statusCode;
    ErrorsList.SERVICE_UNAVAILABLE.statusText = error.message;
    context.dispatch('SERVICE_ERROR', ErrorsList.SERVICE_UNAVAILABLE);
    done(error);
}
