export default function updateUserNotificationsVisibility(context, payload, done) {
    context.dispatch('UPDATE_NOTIFICATIONS_VISIBILITY', payload);
    done();
}
