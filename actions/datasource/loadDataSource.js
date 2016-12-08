import { logger, breadcrumb} from '../../configs/log';

export default function loadDataSource(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    //context.service.read('datasource.item', payload, {timeout: 20 * 1000}, (err, res) => {
    //    if (err) {
    //        context.dispatch('LOAD_DATASOURCE_FAILURE', err);
    //    } else {
    //        context.dispatch('LOAD_DATASOURCE_SUCCESS', res);
    //    }

    //    done();
    //});

    context.dispatch('LOAD_DATASOURCE', payload);
}
