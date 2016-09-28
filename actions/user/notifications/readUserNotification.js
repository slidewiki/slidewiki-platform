import {serviceUnavailable} from '../../error/serviceUnavailable';

export default function readUserNotification(context, payload, done) {
    context.service.delete('notifications.item', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.executeAction(serviceUnavailable, payload, done);
            return;
            // context.dispatch('DELETE_USER_NOTIFICATION_FAILURE', err);
        } else {
            context.dispatch('DELETE_USER_NOTIFICATION_SUCCESS', res);
        }

        done();
    });
}
