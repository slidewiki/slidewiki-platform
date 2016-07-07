export default function resetUserRegistration(context, payload, done) {
    context.dispatch('RESET_USER_REGISTRATION', payload);
    done();
}
