import {shortTitle} from '../../../configs/general';
import serviceUnavailable from '../../error/serviceUnavailable';
const log = require('../../log/clog');

export default function loadNewUserNotificationsCount(context, payload, done) {
    log.info(context);
    context.service.read('notifications.countnew', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_NEW_USER_NOTIFICATIONS_FAILURE', err); // not implemented in store
        } else {
            context.dispatch('LOAD_NEW_USER_NOTIFICATIONS_COUNT_SUCCESS', res);
        }

        done();
    });
}
