import fetchUser from './userprofile/fetchUser.js';
import async from 'async';

export default function userSignIn(context, payload, done) {
    context.service.read('user.signin', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('SIGNIN_FAILURE', err);
            done();
        } else {
            console.log("userSignIn.js.login successful");
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
