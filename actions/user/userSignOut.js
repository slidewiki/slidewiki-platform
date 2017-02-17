import async from 'async';
import {navigateAction} from 'fluxible-router';
const log = require('../log/clog');

export default function userSignOut(context, payload, done) {
    log.info(context, payload);
    async.series([
        // (callback) => {
        //     context.dispatch('USER_SIGNOUT', payload);
        //     callback();
        // },
        (callback) => {
            console.log(location.pathname.split('/')[location.pathname.split('/').length - 1]);

            if (location.pathname.split('/').pop() !== payload.username && location.pathname.includes(payload.username))
                context.executeAction(navigateAction, {url: '/'}, callback);
            else if (location.pathname.split('/').pop() === 'edit') {
                let newPath = location.pathname.substring(0, location.pathname.length - 4).concat('view');
                context.executeAction(navigateAction, {url: newPath}, callback);
            }
            else
                callback();
        },
        (callback) => {
            context.deleteUser(); //clear user (is cookie) via userStoragePlugin
            callback();
        }
    ], (err, result) => {
        if (err) console.log(err);
        done();
    });
}
