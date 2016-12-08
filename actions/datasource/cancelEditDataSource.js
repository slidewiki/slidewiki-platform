import { logger, breadcrumb} from '../../configs/log';

export default function cancelEditDataSource(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    context.dispatch('CANCEL_EDIT_DATASOURCE');
    done();
}
