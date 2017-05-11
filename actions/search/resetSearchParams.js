import {shortTitle} from '../../configs/general';
const log = require('../log/clog');

export default function resetSearchParams(context, payload, done) {
    log.info(context);
    context.dispatch('RESET_PARAMS', payload);
    done();
}
