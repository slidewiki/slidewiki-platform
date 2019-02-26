import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function registerChange(context, payload) {
    context.dispatch('REGISTER_CHANGE', { hasChanges: payload.hasChanges });
}
