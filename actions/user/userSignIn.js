import fetchUser from './userprofile/fetchUser.js';
import async from 'async';
const log = require('../log/clog');

export default function userSignIn(context, payload, done) {
    log.info(context);
    context.service.read('user.signin', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('SIGNIN_FAILURE', err);
            done();
        } else {
            context.setUser(res); //save user as cookie via userStoragePlugin
            try {
                location.reload();
            } catch (e) {
                //nothing - server side
            }
        }
    });
}
