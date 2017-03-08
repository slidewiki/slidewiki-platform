import { shortTitle } from '../../configs/general';
const log = require('../log/clog');

export default function storeFile(context, payload, done) {
    log.info(context);
    context.dispatch('STORE_FILE', payload);
    done();
}
