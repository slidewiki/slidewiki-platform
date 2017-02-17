import serviceUnavailable from '../../error/serviceUnavailable';
const log = require('../../log/clog');

export default function userSignUp(context, payload, done) {
    log.info(context, payload);
    context.service.create('user.registration', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            log.error(context, payload, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('CREATE_USER_FAILURE', err); // not implemented in store
        } else {
            context.dispatch('CREATE_USER_SUCCESS', res);
        }

        done();
    });
}
