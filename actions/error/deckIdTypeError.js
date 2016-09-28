import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export default function deckIdTypeError(context, payload, done) {
    const error = fumble.http.badRequest();
    ErrorsList.DECK_ID_TYPE_ERROR.statusCode = error.statusCode;
    ErrorsList.DECK_ID_TYPE_ERROR.statusText = error.message;
    context.dispatch('TOO_MANY_REQUESTS_ERROR', ErrorsList.DECK_ID_TYPE_ERROR);
    done(error);
}
