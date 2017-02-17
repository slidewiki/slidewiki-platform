const log = require('../log/clog');

export default function hideLeftColumn(context, payload, done) {
    log.info(context, payload);
    context.dispatch('HIDE_LEFT_COLUMN', payload);
    done();
}
