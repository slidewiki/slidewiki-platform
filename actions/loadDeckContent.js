import {shortTitle} from '../configs/general';
export default function loadDeckContent(context, payload, done) {
    context.service.read('deck.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_DECK_CONTENT_FAILURE', err);
        } else {
            context.dispatch('LOAD_DECK_CONTENT_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Deck | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
