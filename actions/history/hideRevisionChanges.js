const log = require('../log/clog');

export default function hideRevisionChanges(context, payload, done) {
    log.info(context);
    context.dispatch('HIDE_REVISION_CHANGES', payload);
    done();
}
