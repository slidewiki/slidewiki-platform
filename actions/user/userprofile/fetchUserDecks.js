import UserProfileStore from '../../../stores/UserProfileStore';
//import notFoundError from '../../error/notFoundError';
import methodNotAllowedError  from '../../error/methodNotAllowedError';
import { isEmpty } from '../../../common.js';
const log = require('../../log/clog');

export function fetchUserDecks(context, payload, done) {
    log.info(context, payload);
    payload.params.id2 = context.getStore(UserProfileStore).user.id;
    payload.params.id = context.getStore(UserProfileStore).userid;
    payload.params.jwt = context.getStore(UserProfileStore).jwt;
    payload.params.loggedInUser = context.getStore(UserProfileStore).username;
    context.service.read('userProfile.fetchUserDecks', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            if (err.statusCode === 404) {
                context.dispatch('NEW_USER_DECKS', []);
            } else if (err.statusCode === 401) {
                context.executeAction(methodNotAllowedError, {}, done);
                return;
            } else
                context.dispatch('FETCH_USER_FAILED', err);
        } else {
            context.dispatch('NEW_USER_DECKS', res);
        }
        done();
    });
}
