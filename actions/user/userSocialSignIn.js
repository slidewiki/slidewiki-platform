import fetchUser from './userprofile/fetchUser.js';
import async from 'async';
const log = require('../log/clog');

export default function userSocialSignIn(context, payload, done) {
    log.info(context);
    context.service.read('user.socialsignin', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('SOCIAL_SIGNIN_FAILURE', err);
            done();
        } else {
            context.setUser(res); //save user as cookie via userStoragePlugin
            context.dispatch('SOCIAL_SIGNIN_SUCCESS', res);
            try {
                location.reload();
            } catch (e) {
                //nothing - server side
            }
            done();
        }
    });
}
