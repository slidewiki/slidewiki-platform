import {shortTitle} from '../configs/general';
import deckContentTypeError from './error/deckContentTypeError';
import slideIdTypeError from './error/slideIdTypeError';
import { AllowedPattern } from './error/util/allowedPattern';
import serviceUnavailable from './error/serviceUnavailable';
import log from './log/clog';
import TranslationStore from '../stores/TranslationStore';

export default function loadContributors(context, payload, done) {
    log.info(context);
    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)){
        context.executeAction(deckContentTypeError, payload, done);
        return;
    }

    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    if (!payload.params.language) payload.params.language = context.getStore(TranslationStore).currentLang;

    context.service.read('contributors.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_CONTRIBUTORS_FAILURE', err);
        } else {
            context.dispatch('LOAD_CONTRIBUTORS_SUCCESS', res);
            // context.dispatch('UPDATE_MODULE_TYPE_SUCCESS', {moduleType: 'contributors'});
        }
        done();
    });
}
