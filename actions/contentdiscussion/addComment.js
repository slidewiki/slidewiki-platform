import {serviceUnavailable} from '../../loadErrors';

export default function addComment(context, payload, done) {
    context.service.create('discussion.comment', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.executeAction(serviceUnavailable, payload).catch((error) => {done(error);});
            return;
            // context.dispatch('ADD_COMMENT_FAILURE', err);
        } else {
            context.dispatch('ADD_COMMENT_SUCCESS', res);
        }

        done();
    });
}
