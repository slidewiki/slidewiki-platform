import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function uploadVideoClick(context, payload, done) {
    context.dispatch('UPLOAD_VIDEO_CLICK', {});
}
