const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function removeSelectedCollections(context, payload, done) {
    log.info(context);
    context.dispatch('REMOVE_SELECTED_COLLECTION', payload);
    done();
}
