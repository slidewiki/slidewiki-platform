export default function saveTreeNode(context, payload, done) {
    //todo: call the service
    context.dispatch('SAVE_TREE_NODE_SUCCESS', payload);
    done();
}
