import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
import { logger, breadcrumb} from '../../configs/log';

export default function deckModeError(context, payload, done) {
    logger.error('Invalid deck mode.', {deck_id: payload.params.id, mode:payload.params.mode, reqId: payload.navigate.reqId, navStack: context.stack});
    const error = fumble.http.badRequest();
    ErrorsList.DECK_MODE_ERROR.statusCode = error.statusCode;
    ErrorsList.DECK_MODE_ERROR.statusText = error.message;
    context.dispatch('DECK_MODE_ERROR', ErrorsList.DECK_MODE_ERROR);
    done(error);
}
