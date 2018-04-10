import {shortTitle} from '../../configs/general';
const log = require('../log/clog');

export default function paintClick(context, payload, done) {
    context.dispatch('PAINT_CLICK', {});
}
