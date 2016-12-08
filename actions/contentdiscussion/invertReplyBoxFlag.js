import { logger, breadcrumb} from '../../configs/log';

export default function invertReplyBoxFlag(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    context.dispatch('INVERT_REPLY_BOX_FLAG', payload);
    done();
}
