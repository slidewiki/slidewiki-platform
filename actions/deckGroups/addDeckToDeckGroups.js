const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

export default function addDecksToDeckGroups(context, payload, done) {
    log.info(context);

    // enrich payload with jwt
    payload.jwt = context.getStore(UserProfileStore).jwt;

    context.service.update('deckgroups.updateDeck', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.dispatch('ADD_DECK_TO_DECK_GROUPS', err);
        }

        done();
    });
}
