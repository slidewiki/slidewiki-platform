import UserProfileStore from '../../stores/UserProfileStore';
import DeckTreeStore from '../../stores/DeckTreeStore';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function deleteTreeNode(context, payload, done) {
    log.info(context);
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        //enrich with user id
        payload.userid = userid;
        context.service.delete('decktree.node', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);
                //context.dispatch('DELETE_TREE_NODE_FAILURE', err);
            } else {
                context.dispatch('DELETE_TREE_NODE_SUCCESS', payload);

                //Create a 'delete' activity
                //find parent deck id
                let parentId = payload.id;
                const pathArray = payload.spath.split(';');
                if (pathArray.length > 1) {
                    const parentDeck = pathArray[pathArray.length - 2];
                    parentId = parentDeck.split(':')[0];
                }
                //find parent deck name
                const flatTree = context.getStore(DeckTreeStore).flatTree;
                let parentName = '';
                for (let i=0; i < flatTree.size; i++) {
                    if (flatTree.get(i).get('type') === 'deck' && flatTree.get(i).get('id') === parentId) {
                        parentName = flatTree.get(i).get('title');
                    }
                }

                let activity = {
                    activity_type: 'delete',
                    user_id: payload.userid,
                    content_id: payload.sid,
                    content_kind: payload.stype,
                    delete_info: {
                        parent_id: parentId,
                        parent_name: parentName
                    }
                };

                context.executeAction(addActivity, {activity: activity});
            }
            done(null, res);
        });
    }
}
