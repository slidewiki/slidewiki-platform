import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function HTMLEditorClick(context, payload, done) {
    context.dispatch('OTHER_CLICK', {});
}
