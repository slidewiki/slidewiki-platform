import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export default function notFoundError(context, payload, done) {
    const error = fumble.http.notFound();
    ErrorsList.NOT_FOUND_ERROR.statusCode = error.statusCode;
    ErrorsList.NOT_FOUND_ERROR.statusText = error.message;
    context.dispatch('NOT_FOUND_ERROR', ErrorsList.NOT_FOUND_ERROR);
    done(error);
}
