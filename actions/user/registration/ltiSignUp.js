export default function ltiSignUp(context, payload, done) {
    context.service.create('user.ltiregistration', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('LTI_CREATE_USER_FAILURE', err);
        } else {
            res.picture = payload.picture || '';
            context.setUser(res); //save user as cookie via userStoragePlugin
            context.dispatch('LTI_SIGNIN_SUCCESS', res);
            try {
                location.reload();
            } catch (e) {
                //nothing - server side
            }
        }
        done();
    });
}
