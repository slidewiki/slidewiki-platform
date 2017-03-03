import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
const log = require('../log/clog');

export default function deckModeError(context, payload, done) {
    log.error(context,  {deck_id: payload.params.id, mode:payload.params.mode, text: 'Invalid deck mode'});
    const error = fumble.http.badRequest();
    ErrorsList.DECK_MODE_ERROR.statusCode = error.statusCode;
    ErrorsList.DECK_MODE_ERROR.statusText = error.message;
    context.dispatch('DECK_MODE_ERROR', ErrorsList.DECK_MODE_ERROR);
    done(error);
}
