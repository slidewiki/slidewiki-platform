import UserProfileStore from '../../stores/UserProfileStore';
const clog = require('../log/clog');

export default function moveTreeNode(context, payload, done) {
    clog.info(context, payload);
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        let {selector, sourceNode, targetNode, targetIndex} = payload;
        let sourceSelector = {
            'id': selector.id,
            'spath': sourceNode.get('path'),
            'sid': sourceNode.get('id'),
            'stype': sourceNode.get('type')
        };
        let targetSelector = {
            'id': selector.id,
            'spath': targetNode.get('path'),
            'sid': targetNode.get('id'),
            'stype': targetNode.get('type')
        };
        swal({
            title: 'Refreshing Deck Structure...',
            text: '',
            type: 'success',
            timer: 1000,
            showCloseButton: false,
            showCancelButton: false,
            allowEscapeKey: false,
            showConfirmButton: false
        });
        context.service.update('decktree.move', {
            userid,
            selector,
            sourceSelector,
            targetSelector,
            targetIndex
        }, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                clog.error(context, payload, {filepath: __filename, err: err});
                context.dispatch('MOVE_TREE_NODE_FAILURE', err);
            } else {
                context.dispatch('MOVE_TREE_NODE_SUCCESS', payload);
            }
            done(null, res);
        });
    }
}
