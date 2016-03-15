export default function toggleTreeNode(context, payload, done) {
    context.dispatch('TOGGLE_TREE_NODE_SUCCESS', payload);
    done();
}
