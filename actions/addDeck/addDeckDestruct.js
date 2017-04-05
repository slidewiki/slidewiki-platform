import {shortTitle} from '../../configs/general';
const log = require('../log/clog');

export default function addDeckDestruct(context, payload, done) {
    log.info(context);
    context.dispatch('DESTRUCT', payload);
    done();
}
