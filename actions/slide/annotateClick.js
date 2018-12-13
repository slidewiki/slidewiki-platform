import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function annotateClick(context, payload, done) {
    context.dispatch('ANNOTATE_CLICK', {});
}