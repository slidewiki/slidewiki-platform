import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export default function deckContentTypeError(context, payload, done) {
    const error = fumble.http.badRequest();
    ErrorsList.DECK_CONTENT_TYPE_ERROR.statusCode = error.statusCode;
    ErrorsList.DECK_CONTENT_TYPE_ERROR.statusText = error.message;
    context.dispatch('DECK_CONTENT_TYPE_ERROR', ErrorsList.DECK_CONTENT_TYPE_ERROR);
    done(error);
}
