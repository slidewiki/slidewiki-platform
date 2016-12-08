import { logger, breadcrumb} from '../../configs/log';

export default function switchOnActionTreeNode(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    context.dispatch('SWITCH_ON_ACTION_TREE_NODE_SUCCESS', payload);
    done();
}
