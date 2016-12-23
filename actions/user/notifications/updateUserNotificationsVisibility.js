const clog = require('../../log/clog');

export default function updateUserNotificationsVisibility(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('UPDATE_NOTIFICATIONS_VISIBILITY', payload);
    done();
}
