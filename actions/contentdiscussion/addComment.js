import serviceUnavailable from '../error/serviceUnavailable';
import { logger, breadcrumb} from '../../configs/log';

export default function addComment(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});

    context.service.create('discussion.comment', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            logger.error({reqId: payload.navigate.reqId, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            return;
            // context.dispatch('ADD_COMMENT_FAILURE', err);
        } else {
            context.dispatch('ADD_COMMENT_SUCCESS', res);
        }

        done();
    });
}
