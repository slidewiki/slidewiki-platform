import UserProfileStore from '../../stores/UserProfileStore';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import addActivities from '../activityfeed/addActivities';

export default function addTreeNodeList(context, payload, done) {
    log.info(context);
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        //enrich with user id
        payload.userid = userid;
        context.service.create('decktree.node', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename, err: err});
                context.executeAction(serviceUnavailable, payload, done);
            } else {
                context.dispatch('ADD_TREE_NODELIST_SUCCESS', res); //perhaps another thing is needed..
                let activities = res.map((activity) => {
                    return {
                        activity_type: 'add',
                        user_id: String(context.getStore(UserProfileStore).userid),
                        content_id: String(activity.node.id),
                        content_kind: activity.node.type
                    };

                });
                context.executeAction(addActivities, {activities: activities});
            }
            done(null, res);
        });
    }
}
