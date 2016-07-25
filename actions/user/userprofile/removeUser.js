import { shortTitle } from '../../../configs/general';

export default function removeUser(context, payload, done) {
    context.service.delete('userProfile.removeUser', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('DELETE_USER_FAILURE', err);
        } else {
            context.dispatch('DELETE_USER_SUCCESS', res);
        }
    });
    done();
}
