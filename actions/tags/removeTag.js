const log = require('../log/clog');

export default function removeTag(context, payload, done) {
    log.info(context);
    context.dispatch('REMOVE_TAG', payload);
    done();
}
