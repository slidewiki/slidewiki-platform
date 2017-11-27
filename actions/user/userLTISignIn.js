import fetchUser from './userprofile/fetchUser.js';
import async from 'async';

export default function userLTISignIn(context, payload, done) {
    context.service.read('user.ltisignin', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LTI_SIGNIN_FAILURE', err);
            done();
        } else {
            context.setUser(res); //save user as cookie via userStoragePlugin
            context.dispatch('LTI_SIGNIN_SUCCESS', res);
            try {
                location.reload();
            } catch (e) {
                //nothing - server side
            }
            done();
        }
    });
}
