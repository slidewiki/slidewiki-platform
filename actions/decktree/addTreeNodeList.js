import UserProfileStore from '../../stores/UserProfileStore';
import log from  '../log/clog';
import serviceUnavailable from '../error/serviceUnavailable';
import addActivities from '../activityfeed/addActivities';
import addActivity from '../activityfeed/addActivity';
import { isEmpty } from '../../common.js';

export default function addTreeNodeList(context, payload, done) {
    log.info(context);
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        //enrich with jwt
        payload.jwt = context.getStore(UserProfileStore).jwt;
        context.service.create('decktree.node', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);
            } else {
                context.dispatch('ADD_TREE_NODELIST_SUCCESS', res);
                let activityType = (payload.attach) ? 'attach' : 'add';
                let parentId = payload.selector.id;
                let topParentId = payload.selector.id;
                let tmp = payload.selector.spath.split(';');
                if (tmp.length > 1) {
                    parentId = tmp[tmp.length - 2];
                    tmp = parentId.split(':');
                    parentId = tmp[0];
                }
                
                if(Array.isArray(res.node)){ //More than one slide/deck was added
                    let activities = res.node.map((node) => {
                        let activity = {
                            activity_type: activityType,
                            user_id: String(context.getStore(UserProfileStore).userid),
                            content_id: String(node.id),
                            content_kind: node.type
                        };
                        if (!isEmpty(parentId)) {
                            activity.parent_content_id = parentId;
                            activity.top_parent_content_id = topParentId;
                        }
                        return activity;
                    });
                    context.executeAction(addActivities, {activities: activities});
                } else {  //Only a slide/deck was added
                    let activity = {
                        activity_type: activityType,
                        user_id: String(userid),
                        content_id: String(res.node.id),
                        content_kind: res.node.type
                    };                    
                    if (!isEmpty(parentId)) {
                        activity.parent_content_id = parentId;
                        activity.top_parent_content_id = topParentId;
                    }
                    context.executeAction(addActivity, {activity: activity});
                }



            }
            done(null, res);
        });
    }
}
