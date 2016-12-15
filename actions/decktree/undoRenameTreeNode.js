const clog = require('../log/clog');

export default function undoRenameTreeNode(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('UNDO_RENAME_TREE_NODE_SUCCESS', payload);
    done();
}
