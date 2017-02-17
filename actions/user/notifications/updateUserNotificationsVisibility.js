const log = require('../../log/clog');

export default function updateUserNotificationsVisibility(context, payload, done) {
    log.info(context, payload);
    context.dispatch('UPDATE_NOTIFICATIONS_VISIBILITY', payload);
    done();
}
