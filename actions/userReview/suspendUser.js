import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function suspendUser(context, payload, done) {
    log.info(context);

    context.service.update('userreview.suspend', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            context.dispatch('SUSPEND_SUCCESS', res);
        }

        done();
    });
}
