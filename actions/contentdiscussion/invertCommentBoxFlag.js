import { logger, breadcrumb} from '../../configs/log';

export default function invertCommentBoxFlag(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    context.dispatch('INVERT_COMMENT_BOX_FLAG', payload);
    done();
}
