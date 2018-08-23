const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function getFollowing(context, payload, done) {
    log.info(context);
    context.service.read('following.item', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('GET_FOLLOWING_SUCCESS', res);
        }
        done();
    });
}
