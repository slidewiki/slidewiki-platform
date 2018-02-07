const log = require('../log/clog');

export default function updateSSOData(context, payload, done) {
    log.info(context);
    context.dispatch('SSO_NEW_DATA', payload);
    done();
}
