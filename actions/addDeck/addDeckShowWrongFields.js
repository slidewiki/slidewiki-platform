import {shortTitle} from '../../configs/general';
const clog = require('../log/clog');

export default function addDeckShowWrongFields(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('SHOW_WRONG_FIELDS', payload);
    done();
}
