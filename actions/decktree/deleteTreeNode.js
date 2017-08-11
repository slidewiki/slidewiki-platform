import UserProfileStore from '../../stores/UserProfileStore';
import DeckTreeStore from '../../stores/DeckTreeStore';
import addActivity from '../../actions/activityfeed/addActivity';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function deleteTreeNode(context, payload, done) {
    log.info(context);
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        //enrich with user id
        payload.userid = userid;

        //enrich with data required for 'delete' activity creation
        //find parent deck id
        let parentId = payload.id;
        const pathArray = payload.spath.split(';');
        if (pathArray.length > 1) {
            const parentDeck = pathArray[pathArray.length - 2];
            parentId = parentDeck.split(':')[0];
        }
        //find parent deck name and deleted name
        const flatTree = context.getStore(DeckTreeStore).flatTree;
        let parentName = '';
        let deletedName = '';
        for (let i=0; i < flatTree.size; i++) {
            if (flatTree.get(i).get('type') === 'deck' && flatTree.get(i).get('id') === parentId) {
                parentName = flatTree.get(i).get('title');
            }
            if (flatTree.get(i).get('type') === payload.stype && flatTree.get(i).get('id') === payload.sid) {
                deletedName = flatTree.get(i).get('title');
            }
        }
        payload.parentId = parentId;
        payload.parentName = parentName;
        payload.deletedName = deletedName;

        context.service.delete('decktree.node', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);
                //context.dispatch('DELETE_TREE_NODE_FAILURE', err);
            } else {
                context.dispatch('DELETE_TREE_NODE_SUCCESS', payload);

                //Create a 'delete' activity
                let activity = {
                    activity_type: 'delete',
                    user_id: String(payload.userid),
                    content_id: payload.parentId,
                    content_kind: 'deck',
                    content_name: payload.parentName,
                    delete_info: {
                        content_id: payload.sid,
                        content_kind: payload.stype,
                        content_name: payload.deletedName
                    }
                };
                console.log(activity);

                context.executeAction(addActivity, {activity: activity});
            }
            done(null, res);
        });
    }
}
