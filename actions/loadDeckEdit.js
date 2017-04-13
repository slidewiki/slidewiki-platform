import { shortTitle } from '../configs/general';
import slideIdTypeError from './error/slideIdTypeError';
import { AllowedPattern } from './error/util/allowedPattern';
import UserProfileStore from '../stores/UserProfileStore';
import serviceUnavailable from './error/serviceUnavailable';
const log = require('./log/clog');

export default function loadDeckEdit(context, payload, done) {
    log.info(context);
    // console.log('action loadDeckEdit:', payload);

    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    payload.params.jwt = context.getStore(UserProfileStore).jwt;
    context.service.read('deck.properties', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: JSON.stringify(err).substr(0, 75)});
            // context.executeAction(serviceUnavailable, payload, done);
            context.dispatch('LOAD_DECK_PROPS_FAILURE', err);
            done();
            return;
        }

        context.dispatch('LOAD_DECK_PROPS_SUCCESS', res);
        let pageTitle = shortTitle + ' | Deck Edit | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });

        done();
    });
}
