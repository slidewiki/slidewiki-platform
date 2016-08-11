export default function userSignIn(context, payload, done) {
    context.service.read('user.signin', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('SIGNIN_FAILURE', err);
        } else {
            context.dispatch('SIGNIN_SUCCESS', res);
        }

        done();
    });
}
