import {shortTitle} from '../../configs/general';
const clog = require('../log/clog');

export default function importFinished(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('IMPORT_FINISHED', payload);
    done();
}
