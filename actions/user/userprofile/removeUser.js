import { userSignOut } from '../userSignOut.js';
import { navigateAction } from 'fluxible-router';
import UserProfileStore from '../../../stores/UserProfileStore';
//import notFoundError from '../../error/notFoundError';
import methodNotAllowedError from '../../error/methodNotAllowedError';
import async from 'async';
const clog = require('../../log/clog');

export default function removeUser(context, payload, done) {
    clog.info(context, payload);
    payload.params = {};
    payload.params.id = context.getStore(UserProfileStore).userid;
    payload.params.jwt = context.getStore(UserProfileStore).jwt;
    context.service.delete('userProfile.remove', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            if (err.statusCode === 404) {
                context.dispatch('DELETE_USER_FAILURE', err);
            } else if (err.statusCode === 401 || err.statusCode === 403) {
                context.executeAction(methodNotAllowedError, {}, done);
                return;
            } else
                context.dispatch('DELETE_USER_FAILURE', err);

            done();
        } else {
            async.series([
                (callback) => {
                    context.deleteUser();
                    callback(null, '');
                },
                (callback) => {
                    context.dispatch('DELETE_USER_SUCCESS', null);
                    callback(null, '');
                },
                (callback) => {
                    context.executeAction(navigateAction, { url: '/' });
                    callback(null, '');
                },
                (callback) => {
                    location.reload();
                    callback(null, '');
                }
            ],
            (err, results) => {
                done();
            });
        }
    });
}
