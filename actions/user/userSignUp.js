export default function userSignUp(context, payload, done) {
    context.service.create('user.registration', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('CREATE_USER_FAILURE', err);
        } else {
            context.dispatch('CREATE_USER_SUCCESS', res);
        }

        done();
    });
}
