const clog = require('../../log/clog');

export default function resetUserRegistrationStatus(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('RESET_USER_REGISTRATION_STATUS', payload);
    done();
}
