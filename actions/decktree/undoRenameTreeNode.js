import { logger, breadcrumb} from '../../configs/log';

export default function undoRenameTreeNode(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    context.dispatch('UNDO_RENAME_TREE_NODE_SUCCESS', payload);
    done();
}
