import { logger, breadcrumb} from '../../configs/log';

export default function newDataSource(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    context.dispatch('NEW_DATASOURCE');
}
