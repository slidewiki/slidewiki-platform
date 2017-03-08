import {shortTitle} from '../../configs/general';
const log = require('../log/clog');

export default function addDeckDeleteError(context, payload, done) {
    log.info(context);
    context.dispatch('DELETE_ERROR', payload);
    done();
}
