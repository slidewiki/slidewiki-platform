import { logger, breadcrumb} from '../../configs/log';
import serviceUnavailable from '../error/serviceUnavailable';

export default function likeActivity(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    context.service.update('activities.like', payload, {}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            logger.error({reqId: payload.navigate.reqId, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LIKE_ACTIVITY_FAILURE', err);
        } else {
            context.dispatch('LIKE_ACTIVITY_SUCCESS', res);
        }
        done();
    });
}
