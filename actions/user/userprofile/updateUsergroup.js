export default function updateUsergroup(context, payload, done) {
    context.dispatch('UPDATE_USERGROUP', payload);
    done();
}
