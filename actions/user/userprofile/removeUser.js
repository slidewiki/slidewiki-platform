import { shortTitle } from '../../../configs/general';

export default function removeUser(context, payload, done) {
    console.log('RemoveUser called');
    context.service.delete('userProfile.removeUser', payload, {timeout: 20 * 1000}, (err, res) => {
        console.log(res);
      // if (err) {
      //     context.dispatch('DELETE_ALL_USER_NOTIFICATIONS_FAILURE', err);
      // } else {
      //     context.dispatch('DELETE_ALL_USER_NOTIFICATIONS_SUCCESS', res);
      // }
    });
    done();
}
