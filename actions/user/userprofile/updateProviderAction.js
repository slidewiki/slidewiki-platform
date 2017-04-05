export default function updateProviderAction(context, payload, done) {
    context.dispatch('UPDATE_PROVIDER_ACTION', payload);
    done();
}
