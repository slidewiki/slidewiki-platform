import { logger, breadcrumb} from '../../configs/log';

export default function cancelEditDataSource(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    context.dispatch('CANCEL_EDIT_DATASOURCE');
    done();
}
