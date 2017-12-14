const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

export default function updateCollectionDeckOrder(context, payload, done) {
    log.info(context);

    // enrich payload with jwt
    payload.jwt = context.getStore(UserProfileStore).jwt;

    context.service.update('deckgroups.deckOrder', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.dispatch('UPDATE_COLLECTION_DECK_ORDER_FAILURE', err);
        } else {
            context.dispatch('UPDATE_COLLECTION_DECK_ORDER_SUCCESS', res);
        }
        done();
    });
}
