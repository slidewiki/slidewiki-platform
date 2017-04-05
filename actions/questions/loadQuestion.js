const log = require('../log/clog');

export default function loadQuestion(context, payload, done) {
    log.info(context);
    context.dispatch('LOAD_QUESTION', payload);
    done();
}
