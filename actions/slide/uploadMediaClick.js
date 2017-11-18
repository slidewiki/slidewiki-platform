import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function uploadMediaClick(context, payload, done) {
    context.dispatch('UPLOAD_MEDIA_CLICK', {});
}
