export default function newSocialData(context, payload, done) {
    context.dispatch('NEW_SOCIAL_DATA', payload);
    done();
}
