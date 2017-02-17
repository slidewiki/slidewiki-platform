const log = require('../log/clog');

export default function invertCommentBoxFlag(context, payload, done) {
    log.info(context, payload);
    context.dispatch('INVERT_COMMENT_BOX_FLAG', payload);
    done();
}
