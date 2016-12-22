import { shortTitle } from '../../configs/general';
import deckContentTypeError from '../error/deckContentTypeError';
import slideIdTypeError from '../error/slideIdTypeError';
import { AllowedPattern } from '../error/util/allowedPattern';
import DeckTreeStore from '../../stores/DeckTreeStore.js'
import { isEmpty } from '../../common.js';

export default function loadContentHistory(context, payload, done) {
    if(!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)) {
        context.executeAction(deckContentTypeError, payload).catch((err) => {done(err);});
        return;
    }

    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    if (isEmpty(payload.params.spath)) {
        let deckTreeStore = context.getStore(DeckTreeStore);
        let deckTreeState = deckTreeStore.getState();
        payload.params.spath = deckTreeStore.generateASelectorPath(deckTreeState.flatTree, deckTreeState.selector);
    }

    context.service.read('history.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_CONTENT_HISTORY_FAILURE', err);
        } else {
            context.dispatch('LOAD_CONTENT_HISTORY_SUCCESS', res);
            context.dispatch('UPDATE_MODULE_TYPE_SUCCESS', {moduleType: 'history'});
        }
        let pageTitle = shortTitle + ' | Content History | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
