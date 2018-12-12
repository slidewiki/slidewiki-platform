import UserProfileStore from '../../../stores/UserProfileStore';

export default function leaveUserlti(context, payload, done) {
    context.dispatch('UPDATE_USERLTIS_STATUS', null);
    payload.jwt = context.getStore(UserProfileStore).jwt;
    context.service.update('userProfile.leaveUserlti', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('LEAVE_USERLTI_FAILED', err);
        } else {
            context.dispatch('LEAVE_USERLTI_SUCCESS', payload.ltiid);
        }
        done();
    });
}
