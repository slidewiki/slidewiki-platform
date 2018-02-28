import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function mathsClick(context, payload, done) {
    context.dispatch('MATHS_CLICK', {});
}
