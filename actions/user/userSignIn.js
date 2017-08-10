import fetchUser from './userprofile/fetchUser.js';
import async from 'async';
const log = require('../log/clog');
import {FormattedMessage, defineMessages} from 'react-intl';

export default function userSignIn(context, payload, done) {
    log.info(context);
    context.service.read('user.signin', {email: payload.email, password: payload.password}, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            console.log(err, err.statusCode, err.message);
            switch (err.statusCode) {
                case 404:
                    context.dispatch('SIGNIN_FAILURE', {statusCode: 404, message: payload.errorMessages.error404});
                    break;

                case 423:
                    context.dispatch('SIGNIN_FAILURE', {statusCode: 404, message: payload.errorMessages.error423});
                    break;
            }

            done();
        } else {
            context.setUser(res); //save user as cookie via userStoragePlugin
            try {
                location.reload();
            } catch (e) {
                //nothing - server side
            }
        }
    });
}
