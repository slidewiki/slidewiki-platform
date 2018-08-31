const log = require('../log/clog');

export default function setModalSubtitle(context, payload, done) {
    log.info(context);

    context.dispatch('UPDATE_ADD_DECKS_TO_COLLECTION_MODAL_SUBTITLE', payload);
    done();
}
