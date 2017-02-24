export default function addReply(context, payload, done) {
    context.dispatch('NEW_TAG', payload);
    done();
}
