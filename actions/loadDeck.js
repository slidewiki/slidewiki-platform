import async from 'async';
import {shortTitle} from '../configs/general';
import DeckPageStore from '../stores/DeckPageStore';
import loadContent from './loadContent';
import loadDeckTree from './decktree/loadDeckTree';
import loadActivities from './activityfeed/loadActivities';
import loadContentModules from './loadContentModules';
import deckContentTypeError from './error/deckContentTypeError';
import slideIdTypeError from './error/slideIdTypeError';
import deckContentPathError from './error/deckContentPathError';
import deckIdTypeError from './error/deckIdTypeError';
import deckModeError from './error/deckModeError';
import serviceUnavailable from './error/serviceUnavailable';
import { AllowedPattern } from './error/util/allowedPattern';
const clog = require('./log/clog');

export default function loadDeck(context, payload, done) {
    clog.info(context, payload);
    if (!(AllowedPattern.DECK_ID.test(payload.params.id))) {
        context.executeAction(deckIdTypeError, payload, done);
        return;
    }

    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)) {
        context.executeAction(deckContentTypeError, payload, done);
        return;
    }

    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    if (!(payload.params.spath && (AllowedPattern.DECK_CONTENT_PATH.test(payload.params.spath)) || payload.params.spath === undefined)) {
        context.executeAction(deckContentPathError, payload, done);
        return;
    }

    if (!(['view', 'edit', 'questions', 'datasources'].indexOf(payload.params.mode) > -1 || payload.params.mode === undefined)) {
        context.executeAction(deckModeError, payload, done);
        return;
    }

    //we should store the current content state in order to avoid duplicate load of actions
    let currentState = context.getStore(DeckPageStore).getState();
    let runNonContentActions = 1;
    let pageTitle = shortTitle + ' | Deck | ' + payload.params.id;
    let payloadCustom = payload;
    //if no specific content selector is given, use the deck type, view mode and root deck id as default selector
    if(!payload.params.stype) {
        payloadCustom.params.stype = 'deck';
    }
    if(!payload.params.sid) {
        payloadCustom.params.sid = payload.params.id;
    }
    //path is an optional parameter which might get confused with the mode, therefore we need to disambiguate it:
    if(payload.params.spath) {
        if(!payload.params.mode){
            //if spath does not have ';' and ':' as separator, it means it refers to the mode
            if(payload.params.spath.indexOf(':') === -1 && payload.params.spath.indexOf(';') === -1){
                payloadCustom.params.mode = payload.params.spath;
                payloadCustom.params.spath = '';
            }else{
                payloadCustom.params.mode = 'view';
            }
        }
    }else{
        payloadCustom.params.spath = '';
        payloadCustom.params.mode = 'view';
    }
    context.dispatch('UPDATE_DECK_PAGE_CONTENT', payloadCustom);
    pageTitle = pageTitle + ' | ' + payloadCustom.params.stype + ' | ' + payloadCustom.params.sid + ' | ' + payloadCustom.params.mode;
    if((currentState.selector.id === payloadCustom.params.id) && (currentState.selector.spath === payloadCustom.params.spath)){
        runNonContentActions = 0;
    }
    //load all required actions in parallel
    async.parallel([
        (callback) => {
            context.executeAction(loadContent, payloadCustom, callback);
        },
        (callback) => {
            if(runNonContentActions){
                context.executeAction(loadDeckTree, payloadCustom, callback);
            }else{
                callback();
            }
        },
        (callback) => {
            if(runNonContentActions){
                context.executeAction(loadActivities, payloadCustom, callback);
            }else{
                callback();
            }
        },
        (callback) => {
            if(runNonContentActions){
                context.executeAction(loadContentModules, payloadCustom, callback);
            }else{
                callback();
            }
        }
    ],
    // final callback

    (err, results) => {
        if (err) {
            clog.error(context, payload, {reqId: payload.navigate.reqId, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        }
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
