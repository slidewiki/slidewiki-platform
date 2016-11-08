import UserProfileStore from '../../../stores/UserProfileStore';

export default function removeProvider(context, payload, done) {
    let data = {
        provider: payload,
        jwt: context.getStore(UserProfileStore).jwt
    };
    context.service.update('userProfile.removeProvider', data, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {

        } else {
            context.dispatch('REMOVE_PROVIDER_SUCCESS', payload);
        }
        done();
    });
}
