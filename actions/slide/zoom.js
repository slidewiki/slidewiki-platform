import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function zoom(context, payload, done) {
    context.dispatch('ZOOM', payload);
}
