import UserProfileStore from '../../../stores/UserProfileStore';

export default function saveUsergroup(context, payload, done) {
    payload.params.jwt = context.getStore(UserProfileStore).jwt;
    context.service.update('userProfile.saveUsergroup', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('SAVE_USERGROUP_FAILED', err);
        } else {
            context.dispatch('SAVE_USERGROUP_SUCCESS', res);
        }
        done();
    });
}
