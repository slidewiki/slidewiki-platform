import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
const clog = require('../log/clog');

export default function methodNotAllowedError(context, payload, done) {
    clog.error(context, payload, 'Method not allowed');
    const error = fumble.http.methodNotAllowed();
    ErrorsList.METHOD_NOT_ALLOWED_ERROR.statusCode = error.statusCode;
    ErrorsList.METHOD_NOT_ALLOWED_ERROR.statusText = error.message;
    context.dispatch('METHOD_NOT_ALLOWED_ERROR', ErrorsList.METHOD_NOT_ALLOWED_ERROR);
    done(error);
}
