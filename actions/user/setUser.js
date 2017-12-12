export default function setUser(context, payload, done) {
    context.setUser(payload); //save user as cookie via userStoragePlugin
    done();
}
