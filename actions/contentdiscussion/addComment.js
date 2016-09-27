export default function addComment(context, payload, done) {
    context.service.create('discussion.comment', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('ADD_COMMENT_FAILURE', err);
        } else {
            context.dispatch('ADD_COMMENT_SUCCESS', res);
        }

        done();
    });
}
