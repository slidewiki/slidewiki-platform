export default function likeActivity(context, payload, done) {
    context.service.update('activities.like', payload, {}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LIKE_ACTIVITY_FAILURE', err);
        } else {
            context.dispatch('LIKE_ACTIVITY_SUCCESS', res);
        }
        done();
    });
}
