const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function loadLikes(context, payload, done) {
    log.info(context);
    context.service.read('like.loadLikes', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LIKE_LOAD_FAILURE', err);
        } else {
            context.dispatch('LIKE_LOAD_SUCCESS', res);
        }
        done();
    });
}
