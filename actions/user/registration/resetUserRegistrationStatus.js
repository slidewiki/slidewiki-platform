export default function resetUserRegistrationStatus(context, payload, done) {
    context.dispatch('RESET_USER_REGISTRATION_STATUS', payload);
    done();
}
