const log = require('../log/clog');

export default function openSSOModal(context, payload, done) {
    log.info(context);
    context.dispatch('SSO_MODAL_OPEN', payload);
    done();
}
