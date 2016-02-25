export default function selectTreeNode(context, payload, done) {
    context.dispatch('SELECT_TREE_NODE_SUCCESS', payload.params);
    done();
}
