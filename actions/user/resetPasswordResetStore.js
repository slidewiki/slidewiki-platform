export default function resetPasswordResetStore(context, payload, done) {
    context.dispatch('RESET_RESET_PASSWORD', payload);
    done();
}
