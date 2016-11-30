import UserProfileStore from '../../stores/UserProfileStore';

export default function deleteTreeNode(context, payload, done) {
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        //enrich with user id
        payload.userid = userid;
        context.service.delete('decktree.node', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                console.log('Payload:', payload, 'Error:', err);
                //payload.err = err;
                context.dispatch('DELETE_TREE_NODE_FAILURE', err);
            } else {
                context.dispatch('DELETE_TREE_NODE_SUCCESS', payload);
            }
            done(null, res);
        });
    }
}
