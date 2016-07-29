import { shortTitle } from '../../../configs/general';
import {navigateAction} from 'fluxible-router';

export default function removeUser(context, payload, done) {
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
