import { logger, breadcrumb} from '../../configs/log';

export default function renameTreeNode(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    context.dispatch('RENAME_TREE_NODE_SUCCESS', payload);
    done();
}
