import serviceUnavailable from '../error/serviceUnavailable';
import { logger, breadcrumb} from '../../configs/log';

export default function loadMoreActivities(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    context.service.read('activities.more', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            logger.error({reqId: payload.navigate.reqId, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            return;
            // context.dispatch('LOAD_MORE_ACTIVITIES_FAILURE', err);
        } else {
            context.dispatch('LOAD_MORE_ACTIVITIES_SUCCESS', res);
        }
        done();
    });
}
