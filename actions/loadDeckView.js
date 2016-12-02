import {shortTitle} from '../configs/general';
import slideIdTypeError from './error/slideIdTypeError';
import serviceUnavailable from './error/serviceUnavailable';
import { AllowedPattern } from './error/util/allowedPattern';

export default function loadDeckView(context, payload, done) {
    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    context.service.read('deck.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            console.log('From loadDeckView.js:', err);
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            context.dispatch('LOAD_DECK_CONTENT_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Deck View | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
