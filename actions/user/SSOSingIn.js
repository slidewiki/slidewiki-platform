const log = require('../log/clog');

export default function SSOSignIn(context, payload, done) {
    log.info(context);
    context.service.read('user.ssosignin', {url: payload.url, email: payload.email, password: payload.password}, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            console.log(err, err.statusCode, err.message);
            switch (err.statusCode) {
                case 403:
                    context.dispatch('SSO_SIGNIN_ERROR', {statusCode: 403, message: payload.errorMessages.error403});
                    break;

                case 404:
                    context.dispatch('SSO_SIGNIN_ERROR', {statusCode: 404, message: payload.errorMessages.error404});
                    break;

                case 423:
                    context.dispatch('SSO_SIGNIN_ERROR', {statusCode: 404, message: payload.errorMessages.error423});
                    break;
            }
            done();
        } else {
            context.dispatch('SSO_SIGNIN_SUCCESS', res);
            done();
        }
    });
}
