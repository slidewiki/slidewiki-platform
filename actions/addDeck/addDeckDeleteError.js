import {shortTitle} from '../../configs/general';
const clog = require('../log/clog');

export default function addDeckDeleteError(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('DELETE_ERROR', payload);
    done();
}
