const clog = require('../log/clog');

export default function loadQuestion(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('LOAD_QUESTION', payload);
    done();
}
