import {shortTitle} from '../../configs/general';
const log = require('../log/clog');

export default function importFinished(context, payload, done) {
    log.info(context);
    context.dispatch('IMPORT_FINISHED', payload);
    done();
}
