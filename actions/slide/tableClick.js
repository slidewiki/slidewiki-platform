import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function tableClick(context, payload, done) {
    context.dispatch('TABLE_CLICK', {});
}
