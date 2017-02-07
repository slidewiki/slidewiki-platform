export default function resetProviderStuff(context, payload, done) {
    context.dispatch('RESET_PROVIDER_STUFF', payload);
    done();
}
