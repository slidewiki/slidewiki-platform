import serviceUnavailable from '../error/serviceUnavailable';
import addActivity from '../activityfeed/addActivity';
const log = require('../log/clog');

export default function addComment(context, payload, done) {
    log.info(context);

    context.service.create('discussion.comment', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            return;
            // context.dispatch('ADD_COMMENT_FAILURE', err);
        } else {
            context.dispatch('ADD_COMMENT_SUCCESS', res);
            const comment = res.comment;
            let activity = {
                activity_type: 'comment',
                user_id: comment.user_id,
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
