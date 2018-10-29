const log = require('../log/clog');

export default function deckRemove(context, payload, done) {
    log.info(context);
    context.dispatch('START_DELETE_DECK');
    context.service.delete('deck.remove', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('REMOVE_DECK_ERROR', err);
        }
        else {
            context.dispatch('REMOVE_DECK_SUCCESS', res);
        }
        done();
    });
}
