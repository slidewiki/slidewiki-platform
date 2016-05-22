export default function readUserNotification(context, payload, done) {
    context.dispatch('CLEAR_NOTIFICATION_NEW_PARAMETER', payload);
    done();
}
