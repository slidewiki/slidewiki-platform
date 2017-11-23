import {shortTitle} from '../../configs/general';
import slideIdTypeError from '../error/slideIdTypeError';
import serviceUnavailable from '../error/serviceUnavailable';
import { AllowedPattern } from '../error/util/allowedPattern';
let async = require('async');
const log = require('../log/clog');

export default function loadSlideView(context, payload, done) {
    log.info(context);
    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }
    console.log('send to load');
    context.dispatch('LOAD_SLIDE_PREVIEW_LOAD', {loadingIndicator: 'true'});
    //context.dispatch('LOAD_SLIDE_CONTENT_LOAD');
    //console.log('get content');

    context.service.read('slide.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            async.series([
                (cb) => {
                    if (res.slide){
                        context.dispatch('LOAD_SLIDE_PREVIEW_SUCCESS', res);
                    }
                    cb();
                },
                (cb) => { console.log(res); cb();}
            ], done);

        }
    });
}
