import UserProfileStore from '../../../stores/UserProfileStore';

export default function deleteUsergroup(context, payload, done) {
    payload.params.jwt = context.getStore(UserProfileStore).jwt;
    context.service.update('userProfile.deleteUsergroup', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('DELETE_USERGROUP_FAILED', err);
        } else {
            context.dispatch('DELETE_USERGROUP_SUCCESS', res);
        }
        done();
    });
}
