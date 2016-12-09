import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
import { logger, breadcrumb} from '../../configs/log';

export default function deckContentTypeError(context, payload, done) {
    logger.error('Invalid deck content type.', {deck_id: payload.params.id, stype:payload.params.stype, reqId: payload.navigate.reqId, navStack: context.stack});
    const error = fumble.http.badRequest();
    ErrorsList.DECK_CONTENT_TYPE_ERROR.statusCode = error.statusCode;
    ErrorsList.DECK_CONTENT_TYPE_ERROR.statusText = error.message;
    context.dispatch('DECK_CONTENT_TYPE_ERROR', ErrorsList.DECK_CONTENT_TYPE_ERROR);
    done(error);
}
