import serviceUnavailable from '../../error/serviceUnavailable';
const log = require('../../log/clog');

export default function checkUsername(context, payload, done) {
    log.info(context);
    context.service.read('user.checkusername', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            context.dispatch('CHECK_USERNAME_FAILURE', err);
            context.dispatch('SSO_MODAL_ERROR', {type: 'username', err: err});
        } else {
            context.dispatch('CHECK_USERNAME_SUCCESS', res);
            if (payload.dispatch)
                context.dispatch(payload.dispatch, res.res.taken);
        }

        done();
    });
}
