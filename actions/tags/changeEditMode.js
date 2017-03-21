export default function changeEditMode(context, payload, done) {
    context.dispatch('CHANGE_EDIT_MODE', payload);
    done();
}
