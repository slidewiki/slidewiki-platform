import UserProfileStore from '../../../stores/UserProfileStore';

export default function addProvider(context, payload, done) {
    payload.jwt = context.getStore(UserProfileStore).jwt;
    context.service.update('userProfile.addProvider', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('ADD_PROVIDER_FAILURE', err);
        } else {
            context.dispatch('ADD_PROVIDER_SUCCESS', payload);
        }
        done();
    });
}
