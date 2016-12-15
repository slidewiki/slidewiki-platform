const clog = require('../log/clog');

export default function cancelQuestion(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('CANCEL_QUESTION', payload);
    done();
}
