export default function invertCommentBoxFlag(context, payload, done) {
    context.dispatch('INVERT_COMMENT_BOX_FLAG', payload);
    done();
}
