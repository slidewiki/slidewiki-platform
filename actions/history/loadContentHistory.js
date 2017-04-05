import { shortTitle } from '../../configs/general';
import deckContentTypeError from '../error/deckContentTypeError';
import slideIdTypeError from '../error/slideIdTypeError';
import serviceUnavailable from '../error/serviceUnavailable';
import { AllowedPattern } from '../error/util/allowedPattern';
import DeckTreeStore from '../../stores/DeckTreeStore.js';
import { isEmpty } from '../../common.js';
const log = require('../log/clog');

export default function loadContentHistory(context, payload, done) {
    log.info(context);
    if(!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)) {
        context.executeAction(deckContentTypeError, payload).catch((err) => {done(err);});
        return;
    }

    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    // we need the spath for the history service call
    if (isEmpty(payload.params.spath)) {
        // in current state of the UI, the history tab is always loaded alongside the deck tree,
        // and the loading happens on user click after the page has completed loading,
        // therefore the spath is already calculated and stored in the DeckTreeStore state
        let deckTreeStore = context.getStore(DeckTreeStore);
        let deckTreeState = deckTreeStore.getState();

        payload.params.spath = deckTreeState.selector.get('spath');
    }

    context.service.read('history.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
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
