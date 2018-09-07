const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

// loads deck collections created by the current user or his user groups
export default function loadUserCollections(context, payload, done) {
    log.info(context);

    context.dispatch('SET_COLLECTIONS_LOADING'); // show loading indicator
    let params = (payload.params) ? payload.params : payload;

    params.userId = context.getStore(UserProfileStore).userid;

    // if the logged in user opens another user profile
    if (context.getStore(UserProfileStore).userid !== context.getStore(UserProfileStore).user.id) {
        params.userId = context.getStore(UserProfileStore).user.id;
    } else {
        params.jwt = context.getStore(UserProfileStore).jwt;
        params.usergroups = context.getStore(UserProfileStore).user.groups;
    }

    context.service.read('deckgroups.forUser', params, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, message: err.message});
            context.dispatch('LOAD_USER_COLLECTIONS_FAILURE', err);
        } else {
            context.dispatch('LOAD_USER_COLLECTIONS_SUCCESS', res);
        }

        done();
    });
}
