const log = require('../log/clog');

export default function closeSSOModal(context, payload, done) {
    log.info(context);
    context.dispatch('SSO_MODAL_CLOSE', payload);
    done();
}
