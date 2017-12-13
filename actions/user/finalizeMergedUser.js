const log = require('../log/clog');

const MODI = 'sso_modi';
const NAME = 'sso_data';

export default function finalizeMergedUser(context, payload, done) {
    log.info(context);
    context.service.read('user.ssofinalize', {url: payload.url, email: payload.email, username: payload.username}, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            console.log('ERROR', err, err.statusCode, err.message);
            switch (err.statusCode) {
                case 409:
                    context.dispatch('SSO_FINALIZE_FAILURE', {statusCode: 409, message: payload.errorMessages.error409});
                    break;

                case 404:
                    context.dispatch('SSO_FINALIZE_FAILURE', {statusCode: 404, message: payload.errorMessages.error404});
                    break;

                case 500:
                    context.dispatch('SSO_FINALIZE_FAILURE', {statusCode: 500, message: payload.errorMessages.error500});
                    break;
            }
            done();
        } else {
            localStorage.setItem(NAME, decodeURIComponent(JSON.stringify(res)));

            try {
              window.close();
            } catch (e) {
              console.log('Window could not be closed.');
            }

            done();
        }
    });
}
