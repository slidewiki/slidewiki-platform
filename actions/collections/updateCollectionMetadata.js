const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

export default function updateCollectionDecks(context, payload, done) {
    log.info(context);

    // enrich payload with jwt
    payload.userId = context.getStore(UserProfileStore).userid;
    payload.jwt = context.getStore(UserProfileStore).jwt;

    context.service.update('deckgroups.metadata', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            console.log(err);
            log.error(context, {filepath: __filename});
            context.dispatch('UPDATE_COLLECTION_METADATA_ERROR', err);
        } else {
            context.dispatch('UPDATE_COLLECTION_METADATA', res);
        }
        done();
    });
}
