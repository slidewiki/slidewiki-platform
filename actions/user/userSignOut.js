import async from 'async';
import { navigateAction } from 'fluxible-router';
const clog = require('../log/clog');

export default function userSignOut(context, payload, done) {
    clog.info(context, payload);
    async.series([
        // (callback) => {
        //     context.dispatch('USER_SIGNOUT', payload);
        //     callback();
        // },
        (callback) => {
            if(location.pathname.split('/').pop() !== payload.username && location.pathname.includes(payload.username))
                context.executeAction(navigateAction, { url: '/' }, callback);
            else
                callback();
        },
        (callback) => {
            context.deleteUser(); //clear user (is cookie) via userStoragePlugin
            callback();
        }
    ],
    (err, result) => {
        if(err) console.log(err);
        done();
    });
}
