import { shortTitle } from '../../../configs/general';
import UserProfileStore from '../../../stores/UserProfileStore';
import loadRouteNotFound from '../../loadRouteNotFound';

export default function fetchUser(context, payload, done) {
    payload.params.id = context.getStore(UserProfileStore).userid;
    payload.params.jwt = context.getStore(UserProfileStore).jwt;
    payload.params.loggedInUser = context.getStore(UserProfileStore).username;
    context.service.read('userProfile.read', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            if(err.statusCode === 404)
                console.log('test');
            else
                context.dispatch('EDIT_USER_FAILED', err);
        } else {
            context.dispatch('NEW_USER_DATA', res);
        }
        done();
    });
}
