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
            // async.series([ //outcommented due to location.reload() (see above). Not deleted because it might be needed in the future.
            //     (callback) => {
            //         context.dispatch('SIGNIN_SUCCESS', res);
            //         callback();
            //     },
            //     (callback) => {
            //         context.executeAction(fetchUser, { params: { username: res.username } });
            //         callback();
            //     }
            // ],
            //     (err, result) => {
            //         if (err) console.log(err);
            //         done();
            //     });
        }
    });
}
