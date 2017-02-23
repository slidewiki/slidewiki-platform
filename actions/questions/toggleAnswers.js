const log = require('../log/clog');

export default function toggleAnswers(context, payload, done) {
    log.info(context);
    context.dispatch('TOGGLE_ANSWERS', payload);
    done();
}
