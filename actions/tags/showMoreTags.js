const log = require('../log/clog');

export default function showMoreTags(context, payload, done) {
    log.info(context);

    context.dispatch('SHOW_ALL_TAGS');
}
