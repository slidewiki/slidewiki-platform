import {shortTitle} from '../../../configs/general';

export default function loadNewUserNotifications(context, payload, done) {
    context.service.read('notifications.listnew', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_NEW_USER_NOTIFICATIONS_FAILURE', err);
        } else {
            context.dispatch('LOAD_NEW_USER_NOTIFICATIONS_SUCCESS', res);
        }

        done();
    });
}
