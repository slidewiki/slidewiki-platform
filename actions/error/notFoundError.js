import ErrorStore from '../../stores/ErrorStore';
import { ErrorsList } from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');
import { logger, breadcrumb} from '../../configs/log';

export default function notFoundError(context, payload, done) {
    logger.error('Not found.', {reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    const error = fumble.http.notFound();
    ErrorsList.NOT_FOUND_ERROR.statusCode = error.statusCode;
    ErrorsList.NOT_FOUND_ERROR.statusText = error.message;
    context.dispatch('NOT_FOUND_ERROR', ErrorsList.NOT_FOUND_ERROR);
    done(error);
}
