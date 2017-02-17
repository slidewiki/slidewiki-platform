import serviceUnavailable from '../../error/serviceUnavailable';
const log = require('../../log/clog');

export default function checkEmail(context, payload, done) {
    log.info(context, payload);
    context.service.read('user.checkemail', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            log.error(context, payload, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('CHECK_EMAIL_FAILURE', err);
        } else {
            context.dispatch('CHECK_EMAIL_SUCCESS', res);
        }

        done();
    });
}
