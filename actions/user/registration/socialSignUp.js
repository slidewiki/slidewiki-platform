import {navigateAction} from 'fluxible-router';
const log = require('../../log/clog');

export default function socialSignUp(context, payload, done) {
    log.info(context);
    context.service.create('user.socialregistration', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('SOCIAL_CREATE_USER_FAILURE', err);
        } else {
            res.picture = payload.picture || '';
            context.setUser(res); //save user as cookie via userStoragePlugin
            context.dispatch('SOCIAL_SIGNIN_SUCCESS', res);
            context.executeAction(navigateAction, {
                url: '/user/' + res.username + '/settings/profile'
            });
            try {
                location.reload();
            } catch (e) {
                //nothing - server side
            }
        }
        done();
    });
}
