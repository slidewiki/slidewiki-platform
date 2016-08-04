import async from 'async';
import {shortTitle} from '../configs/general';
import DeckPageStore from '../stores/DeckPageStore';
import loadContent from './loadContent';
import loadDeckTree from './decktree/loadDeckTree';
import loadActivities from './activityfeed/loadActivities';
import loadContentModules from './loadContentModules';
import {ErrorsList} from '../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export default function loadDeck(context, payload, done) {
    if(!(/^\d+$/.test(payload.params.id) && Number.parseInt(payload.params.id) >= 0)) {
        let error = fumble.http.badRequest();
        context.dispatch('DECK_ERROR', ErrorsList.DECK_ID_TYPE_ERROR);
        throw error;
    }

    if(!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)) {
        let error = fumblle.http.badRequest();
        context.dispatch('DECK_ERROR', ErrorsList.DECK_CONTENT_TYPE_ERROR);
        throw error;
    }

    if(!(/^[0-9a-zA-Z]+$/.test(payload.params.sid) || payload.params.sid === undefined)) {
        let error = fumble.http.badRequest();
        context.dispatch('DECK_ERROR', ErrorsList.DECK_CONTENT_ID_TYPE_ERROR);
        throw error;
    }

    if(!(payload.params.spath && (/^[0-9a-z:;]+$/.test(payload.params.spath)) || payload.params.spath === undefined)) {
        let error = fumble.http.badRequest();
        context.dispatch('DECK_ERROR', ErrorsList.DECK_CONTENT_PATH_ERROR);
        throw error;
    }

    if(!(['view', 'edit', 'questions', 'datasources'].indexOf(payload.params.mode) > -1 || payload.params.mode === undefined)) {
        let error = fumble.http.badRequest();
        context.dispatch('DECK_ERROR', ErrorsList.DECK_MODE_ERROR);
        throw error;
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
        if (err){
            console.log(err, 'Something extra');
        }
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
