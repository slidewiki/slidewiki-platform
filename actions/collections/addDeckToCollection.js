const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

export default function addDeckToCollection(context, payload, done) {
    log.info(context);

    // enrich payload with jwt
    payload.jwt = context.getStore(UserProfileStore).jwt;

    // define operation
    payload.op = 'add';

    context.service.update('deckgroups.updateDecksOfCollection', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, message: err.message});
            context.dispatch('ADD_DECK_TO_COLLECTION_FAILURE', err);
        } else {
            context.dispatch('ADD_DECK_TO_COLLECTION_SUCCESS', payload.collection);
        }

        done();
    });
}
