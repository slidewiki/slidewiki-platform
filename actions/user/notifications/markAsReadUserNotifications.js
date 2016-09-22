export default function markAsReadUserNotifications(context, payload, done) {
    context.service.delete('notifications.all', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('DELETE_ALL_USER_NOTIFICATIONS_FAILURE', err);
        } else {
            context.dispatch('DELETE_ALL_USER_NOTIFICATIONS_SUCCESS', res);
        }

        done();
    });
}
