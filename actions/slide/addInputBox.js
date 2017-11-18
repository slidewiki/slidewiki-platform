import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function addInputBox(context, payload, done) {
    context.dispatch('ADD_INPUT_BOX', {});
}
