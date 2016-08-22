
export default function userSignOut(context, payload, done) {
    context.dispatch('USER_SIGNOUT', payload);
    done();
}
