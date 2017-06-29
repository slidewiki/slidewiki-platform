import UserProfileStore from '../../stores/UserProfileStore';
import log from  '../log/clog';
import serviceUnavailable from '../error/serviceUnavailable';
import addActivities from '../activityfeed/addActivities';
import addActivity from '../activityfeed/addActivity';

export default function addTreeNodeList(context, payload, done) {
    log.info(context);
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        //enrich with user id
        payload.userid = userid;
        context.service.create('decktree.node', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);
            } else {
                context.dispatch('ADD_TREE_NODELIST_SUCCESS', res);
                if(Array.isArray(res.node)){ //More than one slide/deck was added
                    let activities = res.node.map((node) => {
                        return {
                            activity_type: 'add',
                            user_id: String(context.getStore(UserProfileStore).userid),
                            content_id: String(node.id),
                            content_kind: node.type
                        };

                    });
                    context.executeAction(addActivities, {activities: activities});
                } else {  //Only a slide/deck was added
                    let activity = {
                        activity_type: 'add',
                        user_id: String(context.getStore(UserProfileStore).userid),
                        content_id: String(res.node.id),
                        content_kind: res.node.type
                    };
                    context.executeAction(addActivity, {activity: activity});
                }



            }
            done(null, res);
        });
    }
}
