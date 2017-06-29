import serviceUnavailable from '../../error/serviceUnavailable';
const log = require('../../log/clog');

export default function markAsReadUserNotifications(context, payload, done) {
    log.info(context);
    context.service.delete('notifications.all', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
            // context.dispatch('DELETE_ALL_USER_NOTIFICATIONS_FAILURE', err);
        } else {
            context.dispatch('DELETE_ALL_USER_NOTIFICATIONS_SUCCESS', res);
        }

        done();
    });
}
