export default function renameTreeNode(context, payload, done) {
    context.dispatch('RENAME_TREE_NODE_SUCCESS', payload);
    done();
}
