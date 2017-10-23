import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function keepReviewingUser(context, payload, done) {
    log.info(context);

    context.service.create('userreview.keepreviewing', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            context.dispatch('KEEP_REVIEWING_SUCCESS', res);
        }

        done();
    });
}
