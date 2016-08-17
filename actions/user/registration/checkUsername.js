export default function checkUsername(context, payload, done) {
    context.service.read('user.checkusername', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('CHECK_USERNAME_FAILURE', err);
        } else {
            context.dispatch('CHECK_USERNAME_SUCCESS', res);
        }

        done();
    });
}
