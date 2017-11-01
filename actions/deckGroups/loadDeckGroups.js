const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

// loads deck groups assigned by the current user to a deck
export default function loadDeckGroups(context, payload, done) {
    log.info(context);

    // enrich payload with user id
    payload.params.userId = context.getStore(UserProfileStore).userid;

    context.service.read('deckgroups.deck', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.dispatch('LOAD_DECK_GROUPS_FAILURE', err);
        } else {
            context.dispatch('LOAD_DECK_GROUPS_SUCCESS', res);
        }

        done();
    });
}
