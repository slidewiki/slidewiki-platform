const log = require('../../log/clog');

export default function updateUserNotificationsVisibility(context, payload, done) {
    log.info(context);
    context.dispatch('UPDATE_NOTIFICATIONS_VISIBILITY', payload);
    done();
}
