import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
import { logger, breadcrumb} from '../../configs/log';

export default function deckIdTypeError(context, payload, done) {
    logger.error('Invalid deck id.', {deck_id: payload.params.id, reqId: payload.navigate.reqId, navStack: context.stack});
    const error = fumble.http.badRequest();
    ErrorsList.DECK_ID_TYPE_ERROR.statusCode = error.statusCode;
    ErrorsList.DECK_ID_TYPE_ERROR.statusText = error.message;
    context.dispatch('TOO_MANY_REQUESTS_ERROR', ErrorsList.DECK_ID_TYPE_ERROR);
    done(error);
}
