import UserProfileStore from '../../../stores/UserProfileStore';
import notFoundError from '../../error/notFoundError';
import methodNotAllowedError from '../../error/methodNotAllowedError';
import { isEmpty } from '../../../common.js';

export default function fetchUser(context, payload, done) {
    payload.params.id = context.getStore(UserProfileStore).userid;
    payload.params.jwt = context.getStore(UserProfileStore).jwt;
    payload.params.loggedInUser = context.getStore(UserProfileStore).username;
    context.service.read('userProfile.read', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            console.log(err.statusCode);
            if (err.statusCode === 404 || err.statusCode === 423 || err.statusCode === 503 || err.statusCode === 500) {
                if(payload.params.username === payload.params.loggedInUser)
                    context.deleteUser();
                else {
                    context.executeAction(notFoundError, {}, done);
                    return;
                }
            } else if (err.statusCode === 403) {
                context.executeAction(methodNotAllowedError, {}, done);
                return;
            } else
                context.dispatch('FETCH_USER_FAILED', err);
        } else {
            if(!isEmpty(payload.params.category)){
                if(context.getStore(UserProfileStore).username === payload.params.username)
                    res.category = isEmpty(payload.params.category) ? '' : payload.params.category;
                else{
                    context.executeAction(notFoundError, {}, done);
                    return;
                }
            } else{
                res.category = '';
            }
            res.onlyPicture = !isEmpty(payload.onlyPicture) ? payload.onlyPicture : false;
            context.dispatch('NEW_USER_DATA', res);
        }
        done();
    });
}
