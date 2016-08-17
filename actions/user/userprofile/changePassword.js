import md5 from 'md5';
import UserProfileStore from '../../../stores/UserProfileStore';

export default function changePassword(context, payload, done) {
    payload.params = {};
    payload.params.id = context.getStore(UserProfileStore).userid;
    payload.params.jwt = context.getStore(UserProfileStore).jwt;
    context.service.update('userProfile.updatePassword', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            if (err.statusCode === 404) {
                context.executeAction(notFoundError, {}).catch(() => { done(err); });
                return;
            } else if (err.statusCode === 401) {
                context.executeAction(methodNotAllowedError, {}).catch(() => { done(err); });
                return;
            } else
                context.dispatch('EDIT_USER_FAILED', err);
        } else {
            context.dispatch('NEW_PASSWORD', res);
        }
        done();
    });
}
