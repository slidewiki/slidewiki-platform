import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export default function slideIdTypeError(context, payload, done) {
    const error = fumble.http.badRequest();
    ErrorsList.SLIDE_ID_TYPE_ERROR.statusCode = error.statusCode;
    ErrorsList.SLIDE_ID_TYPE_ERROR.statusText = error.message;
    context.dispatch('SLIDE_ID_TYPE_ERROR', ErrorsList.SLIDE_ID_TYPE_ERROR);
    done(error);
}
