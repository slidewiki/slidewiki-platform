
export default function userSignOut(context, payload, done) {
    context.deleteUser(); //clear user (is cookie) via userStoragePlugin
    context.dispatch('USER_SIGNOUT', payload);
    done();
}
