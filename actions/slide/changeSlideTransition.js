import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function changeSlideSize(context, payload, done) {
    //catched by slideEditStore
    context.dispatch('CHANGE_SLIDE_TRANSITION', {
        slideTransition: payload.slideTransition,
        transitionType: payload.transitionType
    });
}
