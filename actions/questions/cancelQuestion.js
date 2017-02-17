const log = require('../log/clog');

export default function cancelQuestion(context, payload, done) {
    log.info(context, payload);
    context.dispatch('CANCEL_QUESTION', payload);
    done();
}
