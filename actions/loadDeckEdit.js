import {shortTitle} from '../configs/general';
export default function loadDeckEdit(context, payload, done) {
    if (!(/^[0-9a-zA-Z-]+$/.test(payload.params.sid) || payload.params.sid === undefined))
        console.log('Slide id incorrect. Loading deck edit failed.');

    context.service.read('deck.properties', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_DECK_PROPS_FAILURE', err);
        } else {
            context.dispatch('LOAD_DECK_PROPS_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Deck Edit | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
