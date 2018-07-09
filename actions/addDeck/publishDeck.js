import UserProfileStore from '../../stores/UserProfileStore';
const log = require('../log/clog');
const common = require('../../common.js');

export default function saveDeckEdit(context, payload, done) {
    log.info(context);

    //enrich with jwt
    payload.jwt = context.getStore(UserProfileStore).jwt;
    context.service.update('deck.update', payload, null, {timeout: 30 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('SAVE_DECK_EDIT_FAILURE', err);
            log.error(context, {filepath: __filename});
            // context.executeAction(serviceUnavailable, payload, done);
            done();
        } else {
            done();
        }
    });
}
