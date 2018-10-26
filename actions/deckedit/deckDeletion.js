const log = require('../log/clog');

export default function deckDeletion(context, payload, done) {
    log.info(context);
    context.service.delete('deck.delete', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('DELETE_DECK_ERROR', err);
        }
        else {
            context.dispatch('DELETE_DECK_SUCCESS', res);
        }
        done();
    });
}
