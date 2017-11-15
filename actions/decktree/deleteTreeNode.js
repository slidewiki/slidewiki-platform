import UserProfileStore from '../../stores/UserProfileStore';
import DeckTreeStore from '../../stores/DeckTreeStore';
import addActivity from '../../actions/activityfeed/addActivity';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function deleteTreeNode(context, payload, done) {
    log.info(context);
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        //enrich with jwt
        payload.jwt = context.getStore(UserProfileStore).jwt;

        //enrich with data required for 'delete' activity creation
        //find parent deck id
        let parentId = payload.id;
        const pathArray = payload.spath.split(';');
        if (pathArray.length > 1) {
            const parentDeck = pathArray[pathArray.length - 2];
            parentId = parentDeck.split(':')[0];
        }
        //find parent deck name and deleted name
        const deckTree = context.getStore(DeckTreeStore).deckTree;
        payload.parentId = parentId;
        payload.parentName = getTitle(deckTree, 'deck', parentId);
        payload.deletedName = getTitle(deckTree, payload.stype, payload.sid);

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
                    user_id: String(context.getStore(UserProfileStore).userid),
                    content_id: payload.parentId,
                    content_kind: 'deck',
                    content_name: payload.parentName,
                    delete_info: {
                        content_id: payload.sid,
                        content_kind: payload.stype,
                        content_name: payload.deletedName
                    }
                };

                context.executeAction(addActivity, {activity: activity});
            }
            done(null, res);
        });
    }
}

//find node title
function getTitle(deckTree, type, id) {
    let title = '';
    if (deckTree.get('type') === type && deckTree.get('id') === id) {
        title = deckTree.get('title');
    } else if (deckTree.get('type') === 'deck') {
        deckTree.get('children').forEach((item, index) => {
            if (title === '') {
                title = getTitle(item, type, id);
            }
        });
    }

    return title;
}
