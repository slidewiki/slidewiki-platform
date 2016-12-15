import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
const clog = require('../log/clog');

export default function LoginIncorrectError(context, payload, done) {
    clog.error(context, payload, {msg: 'Login incorrect'});
    const error = fumble.http.forbidden();
    ErrorsList.LOGIN_INCORRECT_ERROR.statusCode = error.statusCode;
    ErrorsList.LOGIN_INCORRECT_ERROR.statusText = error.message;
    context.dispatch('LOGIN_INCORRECT_ERROR', ErrorList.LOGIN_INCORRECT_ERROR);
    done(error);
}
