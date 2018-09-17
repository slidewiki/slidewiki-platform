const log = require('../log/clog');
import UserProfileStore from '../../stores/UserProfileStore';
import serviceUnavailable from '../error/serviceUnavailable';

export default function deleteFollowing(context, payload, done) {
    log.info(context);

    //enrich with jwt
    payload.jwt = context.getStore(UserProfileStore).jwt;

    context.service.delete('following.item', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('DELETE_FOLLOWING_SUCCESS', res);
        }
        done();
    });
}
