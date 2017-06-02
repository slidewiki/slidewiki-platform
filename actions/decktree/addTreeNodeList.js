import UserProfileStore from '../../stores/UserProfileStore';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import addActivity from '../activityfeed/addActivity';

export default function addTreeNodeList(context, payload, done) {
    log.info(context);
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        //enrich with user id
        payload.userid = userid;
        context.service.create('decktree.nodelist', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename, err: err});
                context.executeAction(serviceUnavailable, payload, done);
            } else {
                context.dispatch('ADD_TREE_NODELIT_SUCCESS', res);

                let activity = {
                    activity_type: 'add',
                    user_id: String(context.getStore(UserProfileStore).userid),
                    content_id: String(res.node.id),
                    content_kind: res.node.type
                };
                context.executeAction(addActivity, {activity: activity});
            }
            done(null, res);
        });
    }
}
