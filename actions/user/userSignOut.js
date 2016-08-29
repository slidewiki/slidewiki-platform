
export default function userSignOut(context, payload, done) {
    context.setUser({}); //clear user (is cookie) via userStoragePlugin
    context.dispatch('USER_SIGNOUT', payload);
    done();
}
