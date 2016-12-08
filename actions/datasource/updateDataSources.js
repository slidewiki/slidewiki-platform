import { logger, breadcrumb} from '../../configs/log';
import serviceUnavailable from '../error/serviceUnavailable';

export default function updateDataSources(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    context.service.update('datasource.array', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            logger.error({reqId: payload.navigate.reqId, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('UPDATE_DATASOURCES_FAILURE', err);
        } else {
            context.dispatch('UPDATE_DATASOURCES_SUCCESS', res);
        }

        done();
    });
}
