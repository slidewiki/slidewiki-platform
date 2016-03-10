export default function addTreeNode(context, payload, done) {
    //call the service to add new node
    context.dispatch('ADD_TREE_NODE_SUCCESS', payload.params);
    done();
}
