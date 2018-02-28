import serviceUnavailable from '../../error/serviceUnavailable';
const log = require('../../log/clog');

export default function markAsReadUserNotifications(context, payload, done) {
    log.info(context);
    context.service.update('notifications.readall', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            context.dispatch('READ_ALL_USER_NOTIFICATIONS_SUCCESS', res);
        }

        done();
    });
}
