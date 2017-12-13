import UserProfileStore from '../../stores/UserProfileStore';
import serviceUnavailable from '../error/serviceUnavailable';
import addActivity from '../activityfeed/addActivity';
const log = require('../log/clog');

export default function addReply(context, payload, done) {
    log.info(context);
    context.service.create('discussion.reply', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
            // context.dispatch('ADD_REPLY_FAILURE', err);
        } else {
            context.dispatch('ADD_REPLY_SUCCESS', res);
            const comment = res.comment;
            let activity = {
                activity_type: 'reply',
                user_id: String(context.getStore(UserProfileStore).userid),
                content_id: comment.content_id,
                content_kind: comment.content_kind,
                comment_info: {
                    comment_id: comment.id,
                    text: comment.title
                }
            };
            context.executeAction(addActivity, {activity: activity});
        }

        done();
    });
}
