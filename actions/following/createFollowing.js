const log = require('../log/clog');
import UserProfileStore from '../../stores/UserProfileStore';
import serviceUnavailable from '../error/serviceUnavailable';

export default function createFollowing(context, payload, done) {
    log.info(context);

    const resource = 'following.' + payload.followed_type;
    //enrich with jwt
    payload.jwt = context.getStore(UserProfileStore).jwt;

    context.service.create(resource, payload, {}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('CREATE_FOLLOWING_SUCCESS', res);
        }
        done();
    });
}
