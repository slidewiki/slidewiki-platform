export function updateAuthorizedUsers(context, payload, done) {
    context.dispatch('UPDATE_AUTHORIZED_USERS', payload);
    done();
}

export function updateAuthorizedGroups(context, payload, done) {
    context.dispatch('UPDATE_AUTHORIZED_GROUPS', payload);
    done();
}
