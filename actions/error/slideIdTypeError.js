import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
const log = require('../log/clog');

export default function slideIdTypeError(context, payload, done) {
    log.error(context,  'Invalid slide id');
    const error = fumble.http.badRequest();
    ErrorsList.SLIDE_ID_TYPE_ERROR.statusCode = error.statusCode;
    ErrorsList.SLIDE_ID_TYPE_ERROR.statusText = error.message;
    context.dispatch('SLIDE_ID_TYPE_ERROR', ErrorsList.SLIDE_ID_TYPE_ERROR);
    done(error);
}
