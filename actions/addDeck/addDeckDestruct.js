import {shortTitle} from '../../configs/general';
const clog = require('../log/clog');

export default function addDeckDestruct(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('DESTRUCT', payload);
    done();
}
