import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
import { logger, breadcrumb} from '../../configs/log';

export default function slideIdTypeError(context, payload, done) {
    logger.error('Invalid slide id.', {deck_id: payload.params.id, slide_id: payload.params.sid, reqId: payload.navigate.reqId, navStack: context.stack});
    const error = fumble.http.badRequest();
    ErrorsList.SLIDE_ID_TYPE_ERROR.statusCode = error.statusCode;
    ErrorsList.SLIDE_ID_TYPE_ERROR.statusText = error.message;
    context.dispatch('SLIDE_ID_TYPE_ERROR', ErrorsList.SLIDE_ID_TYPE_ERROR);
    done(error);
}
