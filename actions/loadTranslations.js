import { shortTitle } from '../configs/general';
import deckContentTypeError from './error/deckContentTypeError';
import slideIdTypeError from './error/slideIdTypeError';
import { AllowedPattern } from './error/util/allowedPattern';
const clog = require('./log/clog');
import serviceUnavailable from './error/serviceUnavailable';

export default function loadTranslations(context, payload, done) {
    clog.info(context, payload);
    if(!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)) {
        context.executeAction(deckContentTypeError, payload, done);
        return;
    }

    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    context.service.read('translation.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            clog.error(context, payload, {reqId: payload.navigate.reqId, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            context.dispatch('LOAD_TRANSLATIONS_FAILURE', err);
        } else {
            context.dispatch('LOAD_TRANSLATIONS_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Translations | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
