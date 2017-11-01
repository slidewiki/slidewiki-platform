const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

// loads deck groups created by the current user
export default function loadUserDeckGroups(context, payload, done) {
    log.info(context);

    // enrich payload with user id
    payload.userId = context.getStore(UserProfileStore).userid;

    context.service.read('deckgroups.user', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.dispatch('LOAD_USER_DECK_GROUPS_FAILURE', err);
        } else {
            context.dispatch('LOAD_USER_DECK_GROUPS_SUCCESS', res);
        }

        done();
    });
}
