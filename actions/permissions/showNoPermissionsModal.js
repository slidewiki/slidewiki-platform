const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function showNoPermissionsModal(context, payload, done) {
    context.service.read('deck.forks', payload, {}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('SHOW_NO_PERMISSIONS_MODAL', {ownedForks: res});
        }
        done();
    });
}
