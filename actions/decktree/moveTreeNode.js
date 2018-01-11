import UserProfileStore from '../../stores/UserProfileStore';
import addActivity from '../activityfeed/addActivity';
const log = require('../log/clog');

export default function moveTreeNode(context, payload, done) {
    log.info(context);
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        let jwt = context.getStore(UserProfileStore).jwt;
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
        })
        .then(() => {/* Confirmed */}, (reason) => {/* Canceled */});
        context.service.update('decktree.move', {
            jwt,
            selector,
            sourceSelector,
            targetSelector,
            targetIndex
        }, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.dispatch('MOVE_TREE_NODE_FAILURE', err);
            } else {
                context.dispatch('MOVE_TREE_NODE_SUCCESS', payload);

                let sourceId = undefined;
                const sourcePathArray = sourceNode.get('path').split(';');
                if (sourcePathArray.length > 1 && sourcePathArray[sourcePathArray.length - 2] !== '') {
                    const parentDeck = sourcePathArray[sourcePathArray.length - 2];
                    sourceId = parentDeck.split(':')[0];
                }
                let targetId = undefined;
                const targetPathArray = targetNode.get('path').split(';');
                if (targetPathArray.length > 0 && targetPathArray[targetPathArray.length - 1] !== '') {
                    const parentDeck = targetPathArray[targetPathArray.length - 1];
                    targetId = parentDeck.split(':')[0];
                }

                if (sourceId === undefined) {
                    sourceId = selector.id;// root deck
                }
                if (targetId === undefined) {
                    targetId = selector.id;// root deck
                }

                if (sourceId !== undefined) {
                    let activity = {
                        activity_type: 'move',
                        user_id: String(userid),
                        content_name: res.title,
                        content_id: String(res.id),
                        content_kind: res.type,
                        move_info: {
                            source_id: sourceNode.get('id'),
                            target_id: targetNode.get('id')
                        }
                    };
                    context.executeAction(addActivity, {activity: activity});
                }
            }
            done(null, res);
        });
    }
}
