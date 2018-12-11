import UserProfileStore from '../../../stores/UserProfileStore';
import {navigateAction} from 'fluxible-router';

export default function saveUserlti(context, payload, done) {
    context.dispatch('SAVE_USERLTI_START', {});
    payload.jwt = context.getStore(UserProfileStore).jwt;
    context.service.update('userProfile.saveUserlti', payload, {timeout: 60 * 1000}, { timeout: 60 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('SAVE_USERLTI_FAILED', err);
        } else {
            context.dispatch('SAVE_USERLTI_SUCCESS', res);
            context.executeAction(navigateAction, {
                url: '/user/' + context.getStore(UserProfileStore).username + '/ltis/overview'
            });
        }
        done();
    });
}
