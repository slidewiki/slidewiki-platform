import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
const log = require('../log/clog');

export default function serviceUnavailable(context, payload, done) {
    const error = fumble.http.serviceUnavailable();
    ErrorsList.SERVICE_UNAVAILABLE.statusCode = error.statusCode;
    ErrorsList.SERVICE_UNAVAILABLE.statusText = error.message;
    ErrorsList.SERVICE_UNAVAILABLE.navStack = (context.stack.slice()).join(', ');
    log.error(context, ErrorsList.SERVICE_UNAVAILABLE);
    context.dispatch('SERVICE_UNAVAILABLE', ErrorsList.SERVICE_UNAVAILABLE);
    done(error);
}
