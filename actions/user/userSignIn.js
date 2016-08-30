import fetchUser from './userprofile/fetchUser.js';

export default function userSignIn(context, payload, done) {
    context.service.read('user.signin', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('SIGNIN_FAILURE', err);
            done();
        } else {
            context.setUser(res); //save user as cookie via userStoragePlugin
            context.dispatch('SIGNIN_SUCCESS', res);
            context.executeAction(fetchUser, {params: {username: res.username}});
            done();
        }
    });
}
