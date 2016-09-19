import {shortTitle} from '../configs/general';
import { slideIdTypeError } from './loadErrors';

export default function loadDeckView(context, payload, done) {
    if (!(/^[0-9a-zA-Z-]+$/.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload).catch((err) => {done(err);});
        return;
    }

    context.service.read('deck.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_DECK_CONTENT_FAILURE', err);
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
