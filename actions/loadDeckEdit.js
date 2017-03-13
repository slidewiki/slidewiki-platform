import { shortTitle } from '../configs/general';
import slideIdTypeError from './error/slideIdTypeError';
import { AllowedPattern } from './error/util/allowedPattern';
import UserProfileStore from '../stores/UserProfileStore';
import serviceUnavailable from './error/serviceUnavailable';
const log = require('./log/clog');

export default function loadDeckEdit(context, payload, done) {
    log.info(context);

    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    payload.params.jwt = context.getStore(UserProfileStore).jwt;
    context.service.read('deck.properties', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            // context.executeAction(serviceUnavailable, payload, done);
            context.dispatch('LOAD_DECK_PROPS_FAILURE', err);
            done();
            return;
        }
        
        console.log('got deck properties:', res.deckProps);
        console.log('got deck contributors:', res.editors);
        console.log('got deck permissions:', res.permissions);
        context.dispatch('LOAD_DECK_PROPS_SUCCESS', res);
        let pageTitle = shortTitle + ' | Deck Edit | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });

        done();
    });
}
