export default function loadQuestion(context, payload, done) {
    context.dispatch('LOAD_QUESTION', payload);
    done();
}
