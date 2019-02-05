import { shortTitle } from '../../configs/general';
const log = require('../log/clog');

export default function storeTags(context, payload, done) {
    log.info(context);
    context.dispatch('STORE_TAGS', payload);
    done();
}
