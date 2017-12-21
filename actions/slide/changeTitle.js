import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function saveClick(context, payload, done) {
    context.dispatch('CHANGE_TITLE', {
        title: payload.title
    });
}
