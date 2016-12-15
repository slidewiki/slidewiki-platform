import { shortTitle } from '../../configs/general';
const clog = require('../log/clog');

export default function storeFile(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('STORE_FILE', payload);
    done();
}
