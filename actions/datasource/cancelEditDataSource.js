export default function cancelEditDataSource(context, payload, done) {
    context.dispatch('CANCEL_EDIT_DATASOURCE');
    done();
}
