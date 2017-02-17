const log = require('../log/clog');

export default function invertReplyBoxFlag(context, payload, done) {
    log.info(context, payload);
    context.dispatch('INVERT_REPLY_BOX_FLAG', payload);
    done();
}
