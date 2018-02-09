const log = require('../log/clog');

export default function chooseAction(context, payload, done) {
    log.info(context);
    context.dispatch('SSO_INITIATE', {instance: payload.params.instance, email: decodeURIComponent(payload.params.email)});
    done();
}
