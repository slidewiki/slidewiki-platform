const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';
import addDeckToCollection from './addDeckToCollection';

export default function addNewCollection(context, payload, done) {
    log.info(context);

    // enrich payload with jwt
    payload.jwt = context.getStore(UserProfileStore).jwt;

    context.service.create('deckgroups.create', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.dispatch('ADD_COLLECTION_FAILURE', err);
            done();
        } else {

            // also add new collection to a deck
            if (payload.deckId) {
                context.executeAction(addDeckToCollection, {
                    deckId: payload.deckId, 
                    collection: res, 
                    collectionId: res._id,
                }, done);
            } else {
                context.dispatch('ADD_COLLECTION_SUCCESS', res);
                done();
            }
        }
    });
}
