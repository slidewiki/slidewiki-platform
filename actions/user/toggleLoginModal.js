export default function toggleLoginModal(context, payload, done) {
    context.dispatch('TOGGLE_LOGIN_MODAL', payload);
}
