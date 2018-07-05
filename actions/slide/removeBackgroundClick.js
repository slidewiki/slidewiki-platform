import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function removeBackgroundClick(context, payload, done) {
    context.dispatch('REMOVE_BACKGROUND_CLICK', {});
}
