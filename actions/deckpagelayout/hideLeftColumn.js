import { logger, breadcrumb} from '../../configs/log';

export default function hideLeftColumn(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    context.dispatch('HIDE_LEFT_COLUMN', payload);
    done();
}
