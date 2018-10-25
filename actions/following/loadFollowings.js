const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function loadFollowings(context, payload, done) {
    log.info(context);

    const resource = 'following.all';
    context.service.read(resource, payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('LOAD_FOLLOWINGS_SUCCESS', res);
        }
        done();
    });
}
