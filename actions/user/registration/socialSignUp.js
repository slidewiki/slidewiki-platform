export default function socialSignUp(context, payload, done) {
    context.service.create('user.socialregistration', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('SOCIAL_CREATE_USER_FAILURE', err);
            done();
        } else {
            //context.dispatch('SOCIAL_CREATE_USER_SUCCESS', res);

            context.setUser(res); //save user as cookie via userStoragePlugin
            context.dispatch('SIGNIN_SUCCESS', res);
            done();
        }
    });
}
