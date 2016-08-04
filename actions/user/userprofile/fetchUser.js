import { shortTitle } from '../../../configs/general';
import UserProfileStore from '../../../stores/UserProfileStore';

export default function fetchUser(context, payload, done) {
    payload.params.id = context.getStore(UserProfileStore).userid;
    payload.params.jwt = context.getStore(UserProfileStore).jwt;
    payload.params.loggedInUser = context.getStore(UserProfileStore).username;
    context.service.read('userProfile.read', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('EDIT_USER_FAILED', err);
        } else {
            context.dispatch('NEW_USER_DATA', res);
        }
        done();
    });
}
