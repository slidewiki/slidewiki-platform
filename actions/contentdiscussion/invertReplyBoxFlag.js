export default function invertReplyBoxFlag(context, payload, done) {
    context.dispatch('INVERT_REPLY_BOX_FLAG', payload);
    done();
}
