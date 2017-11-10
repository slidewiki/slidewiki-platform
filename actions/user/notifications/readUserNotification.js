import serviceUnavailable from '../../error/serviceUnavailable';
const log = require('../../log/clog');

export default function readUserNotification(context, payload, done) {
    log.info(context);
    context.service.update('notifications.read', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            context.dispatch('READ_USER_NOTIFICATION_SUCCESS', res);
        }

        done();
    });
}
