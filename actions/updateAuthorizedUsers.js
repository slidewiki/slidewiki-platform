export default function updateAuthorizedUsers(context, payload, done) {
    context.dispatch('UPDATE_AUTHORIZED_USERS', payload);
    done();
}
