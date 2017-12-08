const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import notFoundError from '../error/notFoundError';

// loads a deck collection
export default function loadCollection(context, payload, done) {
    log.info(context);

    context.dispatch('SET_COLLECTIONS_LOADING'); // show loading indicator

    context.service.read('deckgroups.get', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            if(err.statusCode === 404){
                context.executeAction(notFoundError, {}, done);
                return;
            }
            log.error(context, {filepath: __filename});
            context.dispatch('LOAD_COLLECTION_DETAILS_FAILURE', err);
        } else {
            context.dispatch('LOAD_COLLECTION_DETAILS_SUCCESS', res);
        }

        done();
    });
}
