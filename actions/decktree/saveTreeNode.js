import UserProfileStore from '../../stores/UserProfileStore';
import serviceUnavailable from '../error/serviceUnavailable';
import {navigateAction} from 'fluxible-router';
import addActivity from '../activityfeed/addActivity';
const log = require('../log/clog');

export default function saveTreeNode(context, payload, done) {
    log.info(context);
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        //enrich with jwt
        payload.jwt = context.getStore(UserProfileStore).jwt;
        context.service.update('decktree.nodeTitle', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);
                context.dispatch('SAVE_TREE_NODE_FAILURE', err);
            } else {
                let newSid = payload.selector.sid, newPath = payload.selector.spath;
                if (payload.selector.stype === 'slide') {
                    newSid = res._id + '-' + res.revisions[0].id;
                    if (payload.selector.spath !== '') {
                        let pathArr = payload.selector.spath.split(';');
                        let lastPath = pathArr[pathArr.length - 1];
                        let lastPathPosition = lastPath.split(':')[1];
                        pathArr[pathArr.length - 1] = newSid + ':' + lastPathPosition;
                        newPath = pathArr.join(';');
                    }
                }

                context.dispatch('SAVE_TREE_NODE_SUCCESS', {selector: payload.selector, newValue: payload.newValue, newSid: newSid, newPath: newPath});

                //update the URL
                let newURL = '/deck/' + payload.selector.id + '/' + payload.selector.stype + '/' + newSid + '/' + newPath;
                context.executeAction(navigateAction, {
                    url: newURL
                });

                //create new activity
                let activity = {
                    activity_type: 'edit',
                    user_id: String(userid),
                    content_id: String(newSid),
                    content_kind: payload.selector.stype
                };
                context.executeAction(addActivity, {activity: activity});
            }
            done();
        });
    }
}
