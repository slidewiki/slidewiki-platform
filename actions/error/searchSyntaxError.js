import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
import { logger, breadcrumb} from '../../configs/log';

export default function searchSyntaxError(context, payload, done) {
    logger.error('Search syntax error.', {reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    const error = fumble.http.badRequest();
    ErrorsList.SEARCH_SYNTAX_ERROR.statusCode = error.statusCode;
    ErrorsList.SEARCH_SYNTAX_ERROR.statusText = error.message;
    context.dispatch('SEARCH_SYNTAX_ERROR', ErrorsList.SEARCH_SYNTAX_ERROR);
    done(error);
}
