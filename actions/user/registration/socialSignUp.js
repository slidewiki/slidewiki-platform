export default function socialSignUp(context, payload, done) {
    context.service.create('user.socialregistration', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('SOCIAL_CREATE_USER_FAILURE', err);
            done();
        } else {
            res.picture = payload.picture || '';
            context.setUser(res); //save user as cookie via userStoragePlugin
            context.dispatch('SOCIAL_SIGNIN_SUCCESS', res);
            done();
        }
    });
}
