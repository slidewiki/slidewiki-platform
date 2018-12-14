import {navigateAction} from 'fluxible-router';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');
const common = require('../../common.js');

export default function translateSlideRevision(context, payload, done) {
    context.dispatch('START_TRANSLATION', 'success');
    log.info(context);

    context.service.create('slide.translate', payload, null, {timeout: 30 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            done();
        } else {
            context.dispatch('UPDATE_SLIDE_CONTENT_AFTER_TRANSLATION', res);

        }
    });
}
