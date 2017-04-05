import md5 from 'md5';
import UserProfileStore from '../../../stores/UserProfileStore';
import notFoundError from '../../error/notFoundError';
import methodNotAllowedError  from '../../error/methodNotAllowedError';
const log = require('../../log/clog');

export default function changeUserData(context, payload, done) {
    log.info(context);
    payload.params = {};
    payload.params.id = context.getStore(UserProfileStore).userid;
    payload.params.jwt = context.getStore(UserProfileStore).jwt;
    if (payload.picture.includes('gravatar')) //hack to work with component picture.js
        payload.picture = 'https://www.gravatar.com/avatar/' + md5(payload.email.trim().toLowerCase()) + '?d=mm&s=300';
    context.service.update('userProfile.update', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            if (err.statusCode === 409)
                context.dispatch('EMAIL_NOT_ALLOWED', err);
            else if (err.statusCode === 404) {
                context.executeAction(notFoundError, {}, done);
                return;
            } else if (err.statusCode === 401 || err.statusCode === 403) {
                context.executeAction(methodNotAllowedError, {}, done);
                return;
            } else
                context.dispatch('EDIT_USER_FAILED', err);
        } else {
            context.dispatch('NEW_EDITED_USER_DATA', res);
        }
        done();
    });
}
