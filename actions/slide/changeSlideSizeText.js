import {shortTitle} from '../../configs/general';
const log = require('../log/clog');

export default function changeSlideSizeText(context, payload, done) {
    context.dispatch('CHANGE_SLIDE_SIZE_TEXT', {
        slideSizeText: payload.slideSizeText
    });
}
