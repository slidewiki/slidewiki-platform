const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';
// import loadUserCollections from './loadUserCollections';

export default function deleteCollection(context, payload, done) {
    log.info(context);
    
    // enrich payload with jwt
    payload.jwt = context.getStore(UserProfileStore).jwt;

    context.dispatch('SET_COLLECTIONS_LOADING'); // show loading indicator

    context.service.delete('deckgroups.item', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.dispatch('DELETE_COLLECTION_FAILURE', err);
            return;
        }
        context.dispatch('DELETE_COLLECTION_SUCCESS', {id: payload.id});
    });
}
