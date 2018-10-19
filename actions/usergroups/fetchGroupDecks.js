import UserProfileStore from '../../stores/UserProfileStore';
import methodNotAllowedError  from '../error/methodNotAllowedError';
import { isEmpty } from '../../common.js';
const log = require('../log/clog');

export default function fetchGroupDecks(context, payload, done) {
    log.info(context);
    console.log('fetchGroupDecks', payload);

    payload.params.id = payload.params.groupid;
    payload.params.jwt = context.getStore(UserProfileStore).jwt;
    payload.params.page = 1;        // fetch first page

    context.dispatch('NEW_USER_DECKS_LOADING');
    context.service.read('userProfile.fetchGroupOwnedDecks', payload, { timeout: 20 * 1000 }, (err, res) => {
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
