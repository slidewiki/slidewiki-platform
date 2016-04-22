export default function cancelQuestion(context, payload, done) {
    context.dispatch('CANCEL_QUESTION', payload);
    done();
}
