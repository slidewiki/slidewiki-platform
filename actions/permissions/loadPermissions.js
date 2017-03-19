const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function loadPermissions(context, payload, done) {
    context.service.read('deck.permissions', payload, {}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('UPDATE_PERMISSIONS', {permissions: res});
            done(null, res);
        }
    });
}