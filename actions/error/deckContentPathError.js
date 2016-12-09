import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
import { logger, breadcrumb} from '../../configs/log';

export default function deckContentPathError(context, payload, done) {
    logger.error('Invalid deck content path.', {deck_id: payload.params.id, spath: payload.params.spath, reqId: payload.navigate.reqId, navStack: context.stack});
    const error = fumble.http.badRequest();
    ErrorsList.DECK_CONTENT_TYPE_ERROR.statusCode = error.statusCode;
    ErrorsList.DECK_CONTENT_TYPE_ERROR.statusText = error.message;
    context.dispatch('DECK_CONTENT_TYPE_ERROR', ErrorsList.DECK_CONTENT_TYPE_ERROR);
    done(error);
}
