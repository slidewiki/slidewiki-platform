const clog = require('../log/clog');

export default function toggleAnswers(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('TOGGLE_ANSWERS', payload);
    done();
}
