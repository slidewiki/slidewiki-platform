import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';
const log = require('../log/clog');

export default function suspendUser(context, payload, done) {
    log.info(context);

    payload.jwt = context.getStore(UserProfileStore).jwt;

    context.service.update('userreview.suspend', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.dispatch('REVIEW_ACTION_FAILED', err);
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            context.dispatch('SUSPEND_SUCCESS', res);
        }

        done();
    });
}
