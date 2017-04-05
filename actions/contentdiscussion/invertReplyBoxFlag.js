const log = require('../log/clog');

export default function invertReplyBoxFlag(context, payload, done) {
    log.info(context);
    context.dispatch('INVERT_REPLY_BOX_FLAG', payload);
    done();
}
