export default function openAttachModal(context, payload, done) {
    console.log('action');
    context.dispatch('ATTACHSUBDECKMODAL_OPEN', payload);
    done();
}
