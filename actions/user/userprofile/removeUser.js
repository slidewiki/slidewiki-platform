import { userSignOut } from '../userSignOut.js';
import { navigateAction } from 'fluxible-router';
import UserProfileStore from '../../../stores/UserProfileStore';
//import notFoundError from '../../error/notFoundError';
import methodNotAllowedError from '../../error/methodNotAllowedError';

export default function removeUser(context, payload, done) {
    payload.params = {};
    payload.params.id = context.getStore(UserProfileStore).userid;
    payload.params.jwt = context.getStore(UserProfileStore).jwt;
    context.service.delete('userProfile.remove', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            if (err.statusCode === 404) {
                context.dispatch('DELETE_USER_FAILURE', err);
            } else if (err.statusCode === 401) {
                context.executeAction(methodNotAllowedError, {}, done);
                return;
            } else
                context.dispatch('DELETE_USER_FAILURE', err);
        } else {
            //TODO logout user - context.executeAction(userSignOut, {}); throws an error
            context.executeAction(navigateAction, { url: '/' });
        }
        done();
    });
}
