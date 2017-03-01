export default function toggleAnswers(context, payload, done) {
    context.dispatch('TOGGLE_ANSWERS', payload);
    done();
}
