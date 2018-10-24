import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function contentEditorClick(context, payload, done) {
    context.dispatch('CONTENT_EDITOR_FOCUS', payload);
}
