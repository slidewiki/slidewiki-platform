import UserProfileStore from '../../../stores/UserProfileStore';

export default function deleteUserlti(context, payload, done) {
    context.dispatch('UPDATE_USERLTIS_STATUS', null);
    payload.jwt = context.getStore(UserProfileStore).jwt;
    context.service.update('userProfile.deleteUserlti', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('DELETE_USERLTI_FAILED', err);
        } else {
            context.dispatch('DELETE_USERLTI_SUCCESS', payload.ltiid);
        }
        done();
    });
}
