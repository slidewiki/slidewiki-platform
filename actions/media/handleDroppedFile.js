const log = require('../log/clog');

export default function uploadMediaFile(context, payload, done) {
    log.info(context);
    context.dispatch('HANDLE_DROPPED', payload);
    done();
}
