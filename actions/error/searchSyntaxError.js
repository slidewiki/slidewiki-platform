import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export default function searchSyntaxError(context, payload, done) {
    const error = fumble.http.badRequest();
    ErrorsList.SEARCH_SYNTAX_ERROR.statusCode = error.statusCode;
    ErrorsList.SEARCH_SYNTAX_ERROR.statusText = error.message;
    context.dispatch('SEARCH_SYNTAX_ERROR', ErrorsList.SEARCH_SYNTAX_ERROR);
    done(error);
}
