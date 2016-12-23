import {shortTitle} from '../../../configs/general';
import serviceUnavailable from '../../error/serviceUnavailable';
const clog = require('../../log/clog');

export default function loadNewUserNotifications(context, payload, done) {
    clog.info(context, payload);
    context.service.read('notifications.listnew', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            clog.error(context, payload, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_NEW_USER_NOTIFICATIONS_FAILURE', err); // not implemented in store
        } else {
            context.dispatch('LOAD_NEW_USER_NOTIFICATIONS_SUCCESS', res);
        }

        done();
    });
}
