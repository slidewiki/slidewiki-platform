const clog = require('../log/clog');

export default function resetPasswordResetStore(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('RESET_RESET_PASSWORD', payload);
    done();
}
