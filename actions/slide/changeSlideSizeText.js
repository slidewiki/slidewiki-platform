import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function changeSlideSizeText(context, payload, done) {
    context.dispatch('CHANGE_SLIDE_SIZE_TEXT', {
        slideSizeText: payload.slideSizeText
    });
}
