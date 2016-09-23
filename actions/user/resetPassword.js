export default function resetPassword(context, payload, done) {
    context.service.update('user.resetPassword', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('RESET_PASSWORD_FAILURE', err);
        } else {
            context.dispatch('RESET_PASSWORD_SUCCESS', res);
        }

        done();
    });
}
