export default function resetPassword(context, payload, done) {
    context.service.update('user.resetPassword', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            switch (err.statusCode) {
                case 403: //wrong API key was used
                    context.dispatch('RESET_PASSWORD_WRONG_APIKEY', err);
                    break;
                case 404: //email not in use
                    context.dispatch('RESET_PASSWORD_UNKNOWN_EMAIL', err);
                    break;
                case 500: //server error
                    context.dispatch('RESET_PASSWORD_FAILURE', err);
                    break;
                default:
                    context.dispatch('RESET_PASSWORD_FAILURE', err);
                    break;
            }
        } else {
            context.dispatch('RESET_PASSWORD_SUCCESS', res);
        }

        done();
    });
}
