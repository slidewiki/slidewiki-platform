import { shortTitle } from '../../../configs/general';

export default function fetchUser(context, payload, done) {
    context.service.read('userProfile.read', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('EDIT_USER_FAILED', err);
        } else {
            context.dispatch('NEW_USER_DATA', res);
        }
        done();
    });
}
