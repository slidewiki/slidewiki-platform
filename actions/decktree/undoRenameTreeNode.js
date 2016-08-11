export default function undoRenameTreeNode(context, payload, done) {
    context.dispatch('UNDO_RENAME_TREE_NODE_SUCCESS', payload);
    done();
}
