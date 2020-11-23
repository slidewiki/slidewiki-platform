import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function loadSlideAll(context, payload, done) {
    context.service.read('slide.all', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_SLIDE_ALL_FAILURE', err);
        } else {
            context.dispatch('LOAD_SLIDE_ALL_SUCCESS', res);
        }
        done();
    });
}
