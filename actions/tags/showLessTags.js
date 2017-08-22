const log = require('../log/clog');

export default function showLessTags(context, payload, done) {
    log.info(context);

    context.dispatch('SHOW_LESS_TAGS');
}
