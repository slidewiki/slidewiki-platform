import UserProfileStore from '../../stores/UserProfileStore';
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
console.log('delpayload', payload);
console.log('res', res);

                //find parent id
                let parentId = payload.id;
                const pathArray = payload.spath.split(';');
                if (pathArray.length > 1) {
                    const parentDeck = pathArray[pathArray.length - 2];
                    parentId = parentDeck.split(':')[0];
                }
                let activity = {
                    activity_type: 'delete',
                    user_id: payload.userid,
                    content_id: payload.sid,
                    content_kind: payload.stype,



                    //content_name:??? - ne mora da se posalje jer ce activityservice da iskopa



                    delete_info: {
                      parent_id: parentId,





                        // parent_name? - kako? mozda moze da se iskopa iz decktreestore? ili da se napravi novi action koji ce da pozove deck service

                    }
                };



                //context.executeAction(addActivity, {activity: activity});






            }
            done(null, res);
        });
    }
}
