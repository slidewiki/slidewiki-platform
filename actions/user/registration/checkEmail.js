export default function checkEmail(context, payload, done) {
    context.service.read('user.checkemail', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('CHECK_EMAIL_FAILURE', err);
        } else {
            context.dispatch('CHECK_EMAIL_SUCCESS', res);
        }

        done();
    });
}
