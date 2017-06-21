import {shortTitle} from '../../configs/general';
const log = require('../log/clog');

export default function importCanceled(context, payload, done) {
    log.info(context);
    context.dispatch('IMPORT_CANCELED', payload);
    done();
}
