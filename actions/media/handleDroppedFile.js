const log = require('../log/clog');

export default function handleDroppedFile(context, payload, done) {
    log.info(context);
    try {
        context.dispatch('HANDLE_DROPPED', payload);
    } catch (err) {
        // Literally nothing, the error doesn't affect the focus at all.
    }

    done();
}
