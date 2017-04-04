const log = require('../log/clog');

export default function resetPasswordResetStore(context, payload, done) {
    log.info(context);
    context.dispatch('RESET_RESET_PASSWORD', payload);
    done();
}
