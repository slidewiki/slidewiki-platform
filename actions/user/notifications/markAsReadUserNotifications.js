import serviceUnavailable from '../../error/serviceUnavailable';
const clog = require('../../log/clog');

export default function markAsReadUserNotifications(context, payload, done) {
    clog.info(context, payload);
    context.service.delete('notifications.all', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            clog.error(context, payload, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            return;
            // context.dispatch('DELETE_ALL_USER_NOTIFICATIONS_FAILURE', err);
        } else {
            context.dispatch('DELETE_ALL_USER_NOTIFICATIONS_SUCCESS', res);
        }

        done();
    });
}
