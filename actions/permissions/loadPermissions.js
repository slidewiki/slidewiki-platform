const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import PermissionsStore from '../../stores/PermissionsStore';

export default function loadPermissions(context, payload, done) {
    let currentDeckId = context.getStore(PermissionsStore).getState().deckId;

    if (currentDeckId !== payload.params.id) {
        //load permissions only if root deck changed
        context.service.read('deck.permissions', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);
            } else {
                context.dispatch('LOAD_PERMISSIONS_SUCCESS', {permissions: res, deckId: payload.params.id});
                done();
            }
        });
    } else {
        done();
    }
}
