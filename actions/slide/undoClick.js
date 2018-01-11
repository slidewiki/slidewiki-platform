import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function undoClick(context, payload, done) {
    context.dispatch('UNDO_CLICK', {});
}
