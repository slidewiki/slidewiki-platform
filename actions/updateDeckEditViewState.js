export default function updateDeckEditViewState(context, payload, done) {
    context.dispatch('UPDATE_DECKEDIT_VIEW_STATE', payload);
    done();
}
