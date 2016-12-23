import fetchUser from './userprofile/fetchUser.js';
import async from 'async';
const clog = require('../log/clog');

export default function userSignIn(context, payload, done) {
    clog.info(context, payload);
    context.service.read('user.signin', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('SIGNIN_FAILURE', err);
            done();
        } else {
            context.setUser(res); //save user as cookie via userStoragePlugin
            async.series([
                (callback) => {
                    context.dispatch('SIGNIN_SUCCESS', res);
                    callback();
                },
                (callback) => {
                    context.executeAction(fetchUser, {params: {username: res.username}});
                    callback();
                }
            ],
          (err, result) => {
              if(err) console.log(err);
              done();
          });
        }
    });
}
