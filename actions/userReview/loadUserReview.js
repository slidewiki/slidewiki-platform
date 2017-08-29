import serviceUnavailable from '../error/serviceUnavailable';

const log = require('../log/clog');

export default function loadUserReview(context, payload, done) {
    log.info(context);

    context.service.read('userreview.user', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            context.dispatch('READ_USER_SUCCESS', res);
        }

        done();
    });
}
