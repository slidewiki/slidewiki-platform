const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function addSelectedCollection(context, payload, done) {
    log.info(context);
    context.dispatch('ADD_SELECTED_COLLECTION', payload);
    done();
}
