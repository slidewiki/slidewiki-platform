export default function addProvider(context, payload, done) {
    context.service.create('userProfile.addProvider', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {

        } else {
            context.dispatch('ADD_PROVIDER_SUCCESS', payload);
        }
        done();
    });
}
