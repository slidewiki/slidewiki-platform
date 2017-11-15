import { shortTitle } from '../configs/general';
import deckContentTypeError from './error/deckContentTypeError';
import slideIdTypeError from './error/slideIdTypeError';
import { AllowedPattern } from './error/util/allowedPattern';
import serviceUnavailable from './error/serviceUnavailable';
const log = require('./log/clog');

export default function loadTranslations(context, payload, done) {
    log.info(context);
    if(!(['deck'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)) { //this is slide
        done();
    }else{
        context.service.read('translation.list', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);
                context.dispatch('LOAD_TRANSLATIONS_FAILURE', err);
            } else {
                context.dispatch('LOAD_TRANSLATIONS_SUCCESS', res);
            }
            done();
        });
    }


}
