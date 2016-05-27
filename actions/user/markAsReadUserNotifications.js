export default function markAsReadUserNotifications(context, payload, done) {
    context.dispatch('CLEAR_ALL_NOTIFICATIONS_NEW_PARAMETER', payload);
    done();
}
