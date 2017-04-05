import {shortTitle} from '../../../configs/general';
import serviceUnavailable from '../../error/serviceUnavailable';
const log = require('../../log/clog');

export default function loadUserNotifications(context, payload, done) {
    log.info(context);
    context.service.read('notifications.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            return;
            // context.dispatch('LOAD_USER_NOTIFICATIONS_FAILURE', err);
        } else {
            context.dispatch('LOAD_USER_NOTIFICATIONS_SUCCESS', res);
        }

        done();
    });
}
