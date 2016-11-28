export default function moveTreeNode(context, payload, done) {
    context.dispatch('MOVE_TREE_NODE_SUCCESS', payload);
    done();
}
