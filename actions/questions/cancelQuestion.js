const log = require('../log/clog');

export default function cancelQuestion(context, payload, done) {
    log.info(context);
    context.dispatch('CANCEL_QUESTION', payload);
    done();
}
