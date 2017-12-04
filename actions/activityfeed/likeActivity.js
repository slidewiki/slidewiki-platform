const log = require('../log/clog');
import UserProfileStore from '../../stores/UserProfileStore';
import serviceUnavailable from '../error/serviceUnavailable';

export default function likeActivity(context, payload, done) {
    log.info(context);

    //enrich with jwt
    payload.jwt = context.getStore(UserProfileStore).jwt;

    context.service.create('like.likeActivity', payload, {}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LIKE_ACTIVITY_FAILURE', err);
        } else {
            context.dispatch('LIKE_ACTIVITY_SUCCESS', res);
        }
        done();
    });
}
