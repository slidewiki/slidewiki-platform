const log = require('../log/clog');

export default function newTag(context, payload, done) {
    log.info(context);
    context.dispatch('NEW_TAG', payload);
    done();
}
