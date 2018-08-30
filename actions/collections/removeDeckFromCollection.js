const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

export default function removeDeckFromCollection(context, payload, done) {
    log.info(context);

    // enrich payload with jwt
    payload.jwt = context.getStore(UserProfileStore).jwt;

    // define operation
    payload.op = 'remove';

    context.service.update('deckgroups.updateDecksOfCollection', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, message: err.message});
            context.dispatch('REMOVE_DECK_FROM_COLLECTION_FAILURE', err);
        } else {
            context.dispatch('REMOVE_DECK_FROM_COLLECTION_SUCCESS', {
                collectionId: payload.collectionId
            });
        }

        done();
    });

}
