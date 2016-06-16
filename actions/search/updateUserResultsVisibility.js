
export default function updateUserResultsVisibility(context, payload, done) {
    context.dispatch('UPDATE_RESULTS_VISIBILITY', payload);
    done();
}
