export default function switchOnActionTreeNode(context, payload, done) {
    context.dispatch('SWITCH_ON_ACTION_TREE_NODE_SUCCESS', payload);
    done();
}
