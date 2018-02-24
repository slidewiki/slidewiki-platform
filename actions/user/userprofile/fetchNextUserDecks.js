import methodNotAllowedError  from '../../error/methodNotAllowedError';
import { isEmpty } from '../../../common.js';
const log = require('../../log/clog');

export function fetchNextUserDecks(context, payload, done) {
    log.info(context);
    context.dispatch('FETCH_NEXT_USER_DECKS_LOADING');
    context.service.read('userProfile.fetchUserOwnedDecks', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('FETCH_NEXT_USER_DECKS_FAILED', err);
        } else {
            context.dispatch('FETCH_NEXT_USER_DECKS', res);
        }
        done();
    });
}
