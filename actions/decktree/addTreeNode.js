export default function addTreeNode(context, payload, done) {
    context.service.create('decktree.node', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('ADD_TREE_NODE_FAILURE', err);
        } else {
            context.dispatch('ADD_TREE_NODE_SUCCESS', res);
        }
        done();
    });
}
