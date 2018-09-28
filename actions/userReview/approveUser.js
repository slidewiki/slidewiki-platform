import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';
const log = require('../log/clog');

export default function approveUser(context, payload, done) {
    log.info(context);

    payload.jwt = context.getStore(UserProfileStore).jwt;

    context.service.update('userreview.approve', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            context.dispatch('APPROVE_SUCCESS', res);
        }

        done();
    });
}
