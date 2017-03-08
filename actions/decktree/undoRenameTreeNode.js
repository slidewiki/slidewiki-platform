const log = require('../log/clog');

export default function undoRenameTreeNode(context, payload, done) {
    log.info(context);
    context.dispatch('UNDO_RENAME_TREE_NODE_SUCCESS', payload);
    done();
}
