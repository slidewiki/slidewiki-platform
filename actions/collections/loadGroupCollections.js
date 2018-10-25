const log = require('../log/clog');

// loads user group collections
export default function loadGroupCollections(context, payload, done) {
    log.info(context);

    context.dispatch('SET_COLLECTIONS_LOADING'); // show loading indicator
    let params = (payload.params) ? payload.params : payload;

    context.service.read('deckgroups.forGroup', params, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, message: err.message});
            context.dispatch('LOAD_USER_COLLECTIONS_FAILURE', err);
        } else {
            context.dispatch('LOAD_USER_COLLECTIONS_SUCCESS', res);
        }

        done();
    });
}
