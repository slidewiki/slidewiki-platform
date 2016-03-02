import async from 'async';
import {shortTitle} from '../configs/general';
import DeckPageStore from '../stores/DeckPageStore';
import loadContent from './loadContent';
import loadDeckTree from './loadDeckTree';
import selectTreeNode from './selectTreeNode';
import loadContributors from './loadContributors';
import loadTranslations from './loadTranslations';
import loadDataSources from './loadDataSources';
import loadActivities from './loadActivities';
import loadSimilarContents from './loadSimilarContents';

export default function loadDeck(context, payload, done) {
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
    if((currentState.selector.sid === payloadCustom.params.id) && (currentState.selector.stype === payloadCustom.params.stype) && (currentState.selector.sid === payloadCustom.params.sid)){
        runNonContentActions = 0;
    }
    //load all required actions in parallel
    async.parallel([
        (callback) => {
            context.executeAction(loadContent, payloadCustom, callback);
        },
        (callback) => {
            if(runNonContentActions){
                context.executeAction(loadTranslations, payloadCustom, callback);
            }else{
                callback();
            }
        },
        (callback) => {
            if(runNonContentActions){
                //we need to load the whole tree for first time
                context.executeAction(loadDeckTree, payloadCustom, callback);
            }else{
                //when we only select a node in tree, there is no need to call the external service
                context.executeAction(selectTreeNode, payloadCustom, callback);
            }
        },
        (callback) => {
            if(runNonContentActions){
                context.executeAction(loadContributors, payloadCustom, callback);
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
                context.executeAction(loadSimilarContents, payloadCustom, callback);
            }else{
                callback();
            }
        }
    ],
    // final callback
    (err, results) => {
        if (err){
            console.log(err);
        }
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
