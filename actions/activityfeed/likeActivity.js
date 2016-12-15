const clog = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function likeActivity(context, payload, done) {
    clog.info(context, payload);
    context.service.update('activities.like', payload, {}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            clog.error(context, payload, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LIKE_ACTIVITY_FAILURE', err);
        } else {
            context.dispatch('LIKE_ACTIVITY_SUCCESS', res);
        }
        done();
    });
}
