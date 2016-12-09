import { logger, breadcrumb} from '../../configs/log';

export default function showMoreDataSources(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    context.dispatch('SHOW_ALL_DATASOURCES');
}
