import { logger, breadcrumb} from '../../configs/log';

export default function toggleTreeNode(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    context.dispatch('TOGGLE_TREE_NODE_SUCCESS', payload);
    done();
}
