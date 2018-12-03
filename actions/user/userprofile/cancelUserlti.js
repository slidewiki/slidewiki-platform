import UserProfileStore from '../../../stores/UserProfileStore';
import {navigateAction} from 'fluxible-router';

export default function cancelUserlti(context, payload, done) {

    context.dispatch('CANCEL_USERLTI_SUCCESS');
    context.executeAction(navigateAction, {
        url: '/user/' + context.getStore(UserProfileStore).username + '/ltis/overview'
    });

}
