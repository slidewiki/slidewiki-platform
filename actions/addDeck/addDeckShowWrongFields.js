import {shortTitle} from '../../configs/general';
const log = require('../log/clog');

export default function addDeckShowWrongFields(context, payload, done) {
    log.info(context);
    context.dispatch('SHOW_WRONG_FIELDS', payload);
    done();
}
