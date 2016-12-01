import UserProfileStore from '../../stores/UserProfileStore';

export default function moveTreeNode(context, payload, done) {
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        let {selector, sourceNode, targetNode, targetIndex} = payload;
        let sourceSelector= {'id': selector.id, 'spath': sourceNode.get('path'), 'sid': sourceNode.get('id'), 'stype': sourceNode.get('type')};
        let targetSelector= {'id': selector.id, 'spath': targetNode.get('path'), 'sid': targetNode.get('id'), 'stype': targetNode.get('type')};
        context.service.update('decktree.move', {userid, selector, sourceSelector, targetSelector, targetIndex}, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                context.dispatch('MOVE_TREE_NODE_FAILURE', err);
            } else {
                context.dispatch('MOVE_TREE_NODE_SUCCESS', payload);
            }
            done(res);
        });
    }
}