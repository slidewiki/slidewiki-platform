const log = require('../log/clog');

export default function toggleCronjobModal(context, payload = {}, done) {
    log.info(context);
    context.dispatch('TOGGLE_CRONJOB_MODAL');
    done();
}
