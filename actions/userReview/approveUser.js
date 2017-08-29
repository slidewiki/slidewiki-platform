import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function approveUser(context, payload, done) {
    log.info(context);

    context.service.read('userreview.approve', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            context.dispatch('APPROVE_SUCCESS', res);
        }

        done();
    });
}
