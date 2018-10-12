import UserProfileStore from '../../stores/UserProfileStore';
import {navigateAction} from 'fluxible-router';

export default function saveUsergroup(context, payload, done) {
    context.dispatch('SAVE_USERGROUP_START', {});
    payload.jwt = context.getStore(UserProfileStore).jwt;
    context.service.update('userProfile.saveUsergroup', payload, {timeout: 60 * 1000}, { timeout: 60 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('SAVE_USERGROUP_FAILED', err);
        } else {
            context.dispatch('SAVE_USERGROUP_SUCCESS', payload);
            // console.log('updated usergroup from to', payload, res);
            if (!payload.id) {
                context.executeAction(navigateAction, {
                    url: '/usergroup/' + res.id + '/settings'
                });
            }
        }
        done();
    });
}
