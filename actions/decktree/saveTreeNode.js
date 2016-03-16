export default function saveTreeNode(context, payload, done) {
    context.service.update('decktree.nodeTitle', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('SAVE_TREE_NODE_FAILURE', err);
        } else {
            context.dispatch('SAVE_TREE_NODE_SUCCESS', payload);
        }
        done();
    });
}
