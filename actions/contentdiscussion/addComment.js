import serviceUnavailable from '../error/serviceUnavailable';

export default function addComment(context, payload, done) {
    context.service.create('discussion.comment', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            console.log('addComment: Error:', err);
            context.executeAction(serviceUnavailable, payload, done);
            return;
            // context.dispatch('ADD_COMMENT_FAILURE', err);
        } else {
            context.dispatch('ADD_COMMENT_SUCCESS', res);
        }

        done();
    });
}
