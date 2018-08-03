import log from '../log/clog';
import serviceUnavailable from '../error/serviceUnavailable';

// loads deck collections assigned to a deck
export default function loadDeckUserCollections(context, payload, done) {
    log.info(context);

    context.dispatch('UPDATE_DECK_COLLECTIONS_LOADING', true);

    // then get deck collection options
    context.service.read('deckgroups.forDeck', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, message: err.message});
            context.dispatch('LOAD_DECK_COLLECTIONS_FAILURE', err);
        } else {
            context.dispatch('LOAD_DECK_COLLECTIONS_SUCCESS', res);
        }
        
        context.dispatch('UPDATE_DECK_COLLECTIONS_LOADING', false);

        done();
    });

}
