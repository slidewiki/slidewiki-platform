import async from 'async';
import {shortTitle} from '../configs/general';
import loadDeckView from './loadDeckView';
import loadDeckEdit from './loadDeckEdit';
import loadSlideView from './slide/loadSlideView';
import loadSlideEdit from './slide/loadSlideEdit';
import ContentStore from '../stores/ContentStore';
import { deckContentTypeError, deckModeError, slideIdTypeError } from './loadErrors';

export default function loadContent(context, payload, done) {
    if(!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)) {
        context.executeAction(deckContentTypeError, payload).catch((err) => {done(err);});
        return;
    }

    if(!(/^[0-9a-zA-Z-]+$/.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload).catch((err) => {done(err);});
        return;
    }

    if(!(['view', 'edit', 'questions', 'datasources'].indexOf(payload.params.mode) > -1 || payload.params.mode === undefined)) {
        context.executeAction(deckModeError, payload).catch((err) => {done(err);});
        return;
    }

    let currentState = context.getStore(ContentStore).getState();
    let payloadCustom = payload;
    let runNonContentActions = 1;
    if(currentState.selector.stype === payloadCustom.params.stype && currentState.selector.sid === payloadCustom.params.sid){
        runNonContentActions = 0;
    }

    if(!payload.params.mode) {
        payloadCustom.params.mode = 'view';
    }
    let pageTitle = shortTitle + ' | Content | ' + payload.params.stype + ' | ' + payload.params.sid;
    context.dispatch('UPDATE_CONTENT', payloadCustom);
    //dispatch to the right action
    let targetAction;
    switch (payload.params.stype) {
        case 'deck':
            switch (payload.params.mode) {
                case 'view':
                    targetAction = loadDeckView;
                    //context.executeAction(loadDeckView, payloadCustom, done);
                    break;
                case 'edit':
                    targetAction = loadDeckEdit;
                    //context.executeAction(loadDeckEdit, payloadCustom, done);
                    break;
                default:
                    targetAction = loadDeckView;
            }
            break;
        case 'slide':
            switch (payload.params.mode) {
                case 'view':
                    targetAction = loadSlideView;
                    break;
                case 'edit':
                    targetAction = loadSlideEdit;
                    break;
                default:
                    targetAction = loadSlideView;
            }
            break;
        default:

    }

    async.parallel([
        (callback) => {
            context.executeAction(targetAction, payloadCustom, callback);
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
