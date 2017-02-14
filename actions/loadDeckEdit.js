import { shortTitle } from '../configs/general';
import slideIdTypeError from './error/slideIdTypeError';
import { AllowedPattern } from './error/util/allowedPattern';
import UserProfileStore from '../stores/UserProfileStore';

export default function loadDeckEdit(context, payload, done) {
    // console.log('Action loadDeckEdit');

    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    context.service.read('deck.properties', payload, {timeout: 20 * 1000}, (err, res) => {
        console.log('got deck properties:', res.deckProps);
        console.log('got deck contributors:', res.editors);

        if (err) {
            context.dispatch('LOAD_DECK_PROPS_FAILURE', err);
        } else {
            context.dispatch('LOAD_DECK_PROPS_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Deck Edit | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });

        //check if user should be able to edit the deck
        if (res.deckProps.accessLevel !== 'public') {
            payload.params.jwt = context.getStore(UserProfileStore).jwt;

            if (payload.params.jwt === '') {
                context.dispatch('EDIT_DECK_NOT_ALLOWED', null);
                done();
                return;
            }

            context.service.read('deck.editAllowed', payload, {timeout: 20 * 1000}, (err, res) => {
                if (err || res === false) {
                    context.dispatch('EDIT_DECK_NOT_ALLOWED', null);
                }
                done();
            });
        }
        else
            done();
    });
}
