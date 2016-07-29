import { shortTitle } from '../../../configs/general';
import md5 from 'md5';

export default function changeUserData(context, payload, done) {
    if(payload.picture.includes('gravatar'))//hack to work with component picture.js
        payload.picture = 'https://www.gravatar.com/avatar/' + md5(payload.email.trim().toLowerCase()) + '?d=mm&s=300';
    context.service.update('userProfile.update', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('EDIT_USER_FAILED', err);
        } else {
            context.dispatch('NEW_USER_DATA', res);
        }
        done();
    });
}
