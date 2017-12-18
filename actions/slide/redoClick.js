import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function redoClick(context, payload, done) {
    context.dispatch('REDO_CLICK', {});
}
