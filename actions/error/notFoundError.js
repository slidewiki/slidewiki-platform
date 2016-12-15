import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
const clog = require('../log/clog');

export default function notFoundError(context, payload, done) {
    clog.error(context, payload, {msg: 'Not found'});
    const error = fumble.http.notFound();
    ErrorsList.NOT_FOUND_ERROR.statusCode = error.statusCode;
    ErrorsList.NOT_FOUND_ERROR.statusText = error.message;
    context.dispatch('NOT_FOUND_ERROR', ErrorsList.NOT_FOUND_ERROR);
    done(error);
}
