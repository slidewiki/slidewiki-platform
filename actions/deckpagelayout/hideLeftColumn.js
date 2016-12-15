const clog = require('../log/clog');

export default function hideLeftColumn(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('HIDE_LEFT_COLUMN', payload);
    done();
}
