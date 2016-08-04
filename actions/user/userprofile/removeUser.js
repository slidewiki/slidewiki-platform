import { shortTitle } from '../../../configs/general';
import {navigateAction} from 'fluxible-router';
import UserProfileStore from '../../../stores/UserProfileStore';

export default function removeUser(context, payload, done) {
    payload.params.id = context.getStore(UserProfileStore).userid;
    payload.params.jwt = context.getStore(UserProfileStore).jwt;
    context.service.delete('userProfile.remove', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('DELETE_USER_FAILURE', err);
        } else {
            //TODO redirect user to homepage and logout
            //context.dispatch('DELETE_USER_SUCCESS', res);
            context.executeAction(navigateAction, { url: '/' });
        }
        done();
    });
}
