import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export default function slideIdTypeError(context, payload, done) {
    const error = fumble.http.forbidden();
    ErrorsList.LOGIN_INCORRECT_ERROR.statusCode = error.statusCode;
    ErrorsList.LOGIN_INCORRECT_ERROR.statusText = error.message;
    context.dispatch('LOGIN_INCORRECT_ERROR', ErrorList.LOGIN_INCORRECT_ERROR);
    done(error);
}
