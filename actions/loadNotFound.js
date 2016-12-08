import notFoundError from './error/notFoundError';
import { logger, breadcrumb} from '../configs/log';

export default function loadNotFound(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    context.executeAction(notFoundError, payload, done);
    return;
}
