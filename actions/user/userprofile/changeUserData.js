import { shortTitle } from '../../../configs/general';

export default function changeUserData(context, payload, done) {
    context.service.update('userProfile.update', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('EDIT_USER_FAILED', err);
        } else {
            context.dispatch('NEW_USER_DATA', res);
        }
    });
    done();
}
