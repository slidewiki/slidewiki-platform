const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function dislikeActivity(context, payload, done) {
    log.info(context);
    context.service.create('like.dislikeActivity', payload, {}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('DISLIKE_ACTIVITY_FAILURE', err);
        } else {
            context.dispatch('DISLIKE_ACTIVITY_SUCCESS', res);
        }
        done();
    });
}
