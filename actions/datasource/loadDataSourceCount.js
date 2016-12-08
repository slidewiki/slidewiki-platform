import { logger, breadcrumb} from '../../configs/log';
import serviceUnavailable from '../error/serviceUnavailable';

export default function loadDataSourceCount(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});

    context.service.read('datasource.count', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            logger.error({reqId: payload.navigate.reqId, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_AMOUNT_OF_DATA_SOURCES_FAILURE', err);
        } else {
            context.dispatch('LOAD_AMOUNT_OF_DATA_SOURCES_SUCCESS', res);
        }

        done();
    });
}
