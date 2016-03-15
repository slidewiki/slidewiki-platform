export default function loadMoreActivities(context, payload, done) {
    context.service.read('activities.more', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_MORE_ACTIVITIES_FAILURE', err);
        } else {
            context.dispatch('LOAD_MORE_ACTIVITIES_SUCCESS', res);
        }
        done();
    });
}
