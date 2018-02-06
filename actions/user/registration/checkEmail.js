import serviceUnavailable from '../../error/serviceUnavailable';
const log = require('../../log/clog');

export default function checkEmail(context, payload, done) {
    log.info(context);
    context.service.read('user.checkemail', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('CHECK_EMAIL_FAILURE', err);
            context.dispatch('SSO_MODAL_ERROR', {type: 'email', err: err});
        } else {
            context.dispatch('CHECK_EMAIL_SUCCESS', res);
            console.log('checkEmail', res);
            if (payload.dispatch)
                context.dispatch(payload.dispatch, res.taken);
        }

        done();
    });
}
