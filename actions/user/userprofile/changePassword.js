import { shortTitle } from '../../../configs/general';
import md5 from 'md5';

export default function changePassword(context, payload, done) {
    context.service.update('userProfile.updatePassword', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('EDIT_USER_FAILED', err);
        } else {
            context.dispatch('NEW_PASSWORD', res);
        }
    });
    done();
}
