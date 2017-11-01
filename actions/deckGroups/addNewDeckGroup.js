const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

export default function addNewDeckGroup(context, payload, done) {
    log.info(context);

    // enrich payload with jwt
    payload.jwt = context.getStore(UserProfileStore).jwt;

    context.service.create('deckgroups.create', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.dispatch('ADD_DECK_GROUP_FAILURE', err);
        } else {
            context.dispatch('ADD_DECK_GROUP_SUCCESS', res);
        }

        done();
    });
}
