import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function changeTemplate(context, payload, done) {
    context.dispatch('CHANGE_TEMPLATE', {
        template: payload.template
    });
}
