export default function deleteTreeNode(context, payload, done) {
    context.service.delete('decktree.node', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('DELETE_TREE_NODE_FAILURE', err);
        } else {
            context.dispatch('DELETE_TREE_NODE_SUCCESS', payload);
        }
        done();
    });
}
