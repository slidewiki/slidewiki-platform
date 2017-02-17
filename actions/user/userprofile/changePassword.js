import md5 from 'md5';
import UserProfileStore from '../../../stores/UserProfileStore';
//import notFoundError from '../../error/notFoundError';
import methodNotAllowedError from '../../error/methodNotAllowedError';
import serviceUnavailable from '../../error/serviceUnavailable';
const log = require('../../log/clog');

export default function changePassword(context, payload, done) {
    log.info(context, payload);
    payload.params = {};
    payload.params.id = context.getStore(UserProfileStore).userid;
    payload.params.jwt = context.getStore(UserProfileStore).jwt;
    context.service.update('userProfile.updatePassword', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            if (err.statusCode === 404) {
                context.dispatch('WRONG_PASSWORD', err);
            } else if (err.statusCode === 401 || err.statusCode === 403) {
                context.executeAction(methodNotAllowedError, {}, done);
                return;
            } else {
                log.error(context, payload, {filepath: __filename, err: err});
                context.executeAction(serviceUnavailable, payload, done);
                context.dispatch('EDIT_USER_FAILED', err);
            }
        } else {
            context.dispatch('NEW_PASSWORD', res);
        }
        done();
    });
}
