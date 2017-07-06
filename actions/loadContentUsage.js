import { shortTitle } from '../configs/general';
import deckContentTypeError from './error/deckContentTypeError';
import slideIdTypeError from './error/slideIdTypeError';
import { AllowedPattern } from './error/util/allowedPattern';
import serviceUnavailable from './error/serviceUnavailable';
const log = require('./log/clog');

export default function loadContentUsage(context, payload, done) {
    log.info(context);
    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)){
        context.executeAction(deckContentTypeError, payload, done);
        return;
    }

    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    context.service.read('usage.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.dispatch('LOAD_CONTENT_USAGE_FAILURE', err);
        } else {
            context.dispatch('LOAD_CONTENT_USAGE_SUCCESS', res);
            context.dispatch('UPDATE_MODULE_TYPE_SUCCESS', {moduleType: 'usage'});
        }
        let pageTitle = shortTitle + ' | Content Usage | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
