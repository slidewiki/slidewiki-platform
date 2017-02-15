import {shortTitle} from '../../configs/general';
import deckContentTypeError from '../error/deckContentTypeError';
import slideIdTypeError from '../error/slideIdTypeError';
import {AllowedPattern} from '../error/util/allowedPattern';
import DeckTreeStore from '../../stores/DeckTreeStore.js';
import needsNewRevisionCheck from '../revisioning/needsNewRevisionCheck';
import {isEmpty} from '../../common.js';
import async from 'async';
import UserProfileStore from '../../stores/UserProfileStore';


export default function loadContentHistory(context, payload, done) {
    let params = payload.params;

    if (!(['deck', 'slide', 'question'].indexOf(params.stype) > -1 || params.stype === undefined)) {
        context.executeAction(deckContentTypeError, payload).catch((err) => {
            done(err);
        });
        return;
    }

    if (!(AllowedPattern.SLIDE_ID.test(params.sid) || params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    // we need the spath for the history service call
    if (isEmpty(params.spath)) {
        // in current state of the UI, the history tab is always loaded alongside the deck tree,
        // and the loading happens on user click after the page has completed loading,
        // therefore the spath is already calculated and stored in the DeckTreeStore state
        let deckTreeStore = context.getStore(DeckTreeStore);
        let deckTreeState = deckTreeStore.getState();
        params.spath = deckTreeState.selector.get('spath');
    }

    async.parallel([
    //to check if a user has the right to revert a slide or a deck use the needsNewRevision deck service method
        (callback) => {
            let userid = context.getStore(UserProfileStore).getState().userid;
            if (userid != null && userid !== '') {
                let tmp = params.spath.split(';');
                let targetDeckID;
                if (tmp.length > 1) {
                    targetDeckID = tmp[tmp.length - 2];
                    tmp = targetDeckID.split(':');
                    targetDeckID = tmp[0];
                } else {
                    //target is root deck
                    targetDeckID = params.id;
                }
                //check the revisioning condition
                context.executeAction(needsNewRevisionCheck, {
                    deckID: targetDeckID,
                    userID: userid
                }, callback);
            } else {
                callback();
            }
        },
        (callback) => {
            context.service.read('history.list', payload, {timeout: 20 * 1000}, (err, res) => {
                if (err) {
                    context.dispatch('LOAD_CONTENT_HISTORY_FAILURE', err);
                } else {
                    context.dispatch('LOAD_CONTENT_HISTORY_SUCCESS', res);
                }
                callback();
            });
        }
    ],
    // final callback
    (err, results) => {
        context.dispatch('UPDATE_MODULE_TYPE_SUCCESS', {moduleType: 'history'});
        let pageTitle = shortTitle + ' | Content History | ' + params.stype + ' | ' + params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
