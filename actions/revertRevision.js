export default function revertRevision(context, payload, done) {
    context.service.update('history.revert', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('REVERT_REVISION_FAILURE', err);
        } else {
            context.dispatch('REVERT_REVISION_SUCCESS', res);
        }
        done();
    });
}