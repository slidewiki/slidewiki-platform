import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
import { logger, breadcrumb} from '../../configs/log';

export default function LoginIncorrectError(context, payload, done) {
    logger.error('Login incorrect.', {reqId: payload.navigate.reqId, navStack: context.stack});
    const error = fumble.http.forbidden();
    ErrorsList.LOGIN_INCORRECT_ERROR.statusCode = error.statusCode;
    ErrorsList.LOGIN_INCORRECT_ERROR.statusText = error.message;
    context.dispatch('LOGIN_INCORRECT_ERROR', ErrorList.LOGIN_INCORRECT_ERROR);
    done(error);
}
