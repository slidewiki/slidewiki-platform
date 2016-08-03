import async from 'async';
import {shortTitle} from '../configs/general';
import loadDeckView from './loadDeckView';
import loadDeckEdit from './loadDeckEdit';
import loadSlideView from './slide/loadSlideView';
import loadSlideEdit from './slide/loadSlideEdit';
import loadTabLinks from './loadTabLinks';
import loadContentQuestions from './loadContentQuestions';
import loadDataSources from './datasource/loadDataSources';
import ContentStore from '../stores/ContentStore';

export default function loadContent(context, payload, done) {
    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined))
        console.log('Content type incorrect. Loading content failed.');

    if (!(/^[0-9a-zA-Z]+$/.test(payload.params.sid) || payload.params.sid === undefined))
        console.log('Slide id incorrect. Loading content failed.');

    if (!(payload.params.mode || payload.params.mode === undefined))
        console.log('Incorrect mode. Loading content failed.');

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
                case 'questions':
                    targetAction = loadContentQuestions;
                    break;
                case 'datasources':
                    targetAction = loadDataSources;
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
                case 'questions':
                    targetAction = loadContentQuestions;
                    break;
                case 'datasources':
                    targetAction = loadDataSources;
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
        },
        (callback) => {
            if(runNonContentActions){
                context.executeAction(loadTabLinks, payloadCustom, callback);
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
