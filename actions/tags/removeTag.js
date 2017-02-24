export default function removeTag(context, payload, done) {
    context.dispatch('REMOVE_TAG', payload);
    done();
}
