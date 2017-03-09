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

    context.service.read('deck.properties', payload, {timeout: 20 * 1000}, (err, res) => {
        console.log('got deck properties:', res.deckProps);
        console.log('got deck contributors:', res.editors);

        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_DECK_PROPS_FAILURE', err);
        } else {
            context.dispatch('LOAD_DECK_PROPS_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Deck Edit | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });

        if (err) {
            context.dispatch('EDIT_DECK_NOT_ALLOWED', null);
            done();
            return;
        }

        //check if user should be able to edit the deck
        payload.params.jwt = context.getStore(UserProfileStore).jwt;

        if (payload.params.jwt === '') {
            context.dispatch('EDIT_DECK_NOT_ALLOWED', null);
            done();
        }
        else {
            let payload2 = {
                sid: payload.params.sid,
                jwt: payload.params.jwt
            };
            context.service.read('deck.editAllowed', payload2, {timeout: 20 * 1000}, (err, res) => {
                if (err || res === false) {
                    context.dispatch('EDIT_DECK_NOT_ALLOWED', null);
                    done();
                }
                else {
                    payload2.deckID = payload2.sid;
                    payload2.userID = context.getStore(UserProfileStore).userid;
                    context.service.read('deck.needsNewRevision', payload2, {timeout: 20 * 1000}, (err, res) => {
                        console.log('call to needsnewrevision with', payload2, 'got', err, res);
                        if (res && res.status) {
                            context.dispatch('UPDATE_NEEDS_NEW_REVISION', res.status.needs_revision);
                        }
                        else {
                            //I dont know what to do
                            //TODO
                            console.log('Error:', res);
                        }

                        done();
                    });
                }
            });
        }
    });
}
