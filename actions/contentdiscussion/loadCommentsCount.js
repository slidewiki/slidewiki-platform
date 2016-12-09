import serviceUnavailable from '../error/serviceUnavailable';
import { logger, breadcrumb} from '../../configs/log';

export default function loadCommentsCount(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    context.service.read('discussion.count', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            logger.error({reqId: payload.navigate.reqId, err: {uri: err.uri, statusCode: err.statusCode, message: err.message}});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_AMOUNT_OF_COMMENTS_FAILURE', err);
        } else {
            context.dispatch('LOAD_AMOUNT_OF_COMMENTS_SUCCESS', res);
        }

        done();
    });
}
