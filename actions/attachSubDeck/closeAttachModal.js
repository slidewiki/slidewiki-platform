export default function closeAttachModal(context, payload, done) {
    context.dispatch('ATTACHSUBDECKMODAL_CLOSE', payload);
    done();
}
