import {shortTitle} from '../configs/general';
import loadDeckView from './loadDeckView';
import loadDeckEdit from './loadDeckEdit';
import loadSlideView from './loadSlideView';
import loadSlideEdit from './loadSlideEdit';
import loadContentQuestions from './loadContentQuestions';
import loadDataSources from './datasource/loadDataSources';

export default function loadContent(context, payload, done) {
    let payloadCustom = payload;
    if(!payload.params.mode) {
        payloadCustom.params.mode = 'view';
    }
    context.dispatch('UPDATE_CONTENT', payloadCustom);
    //dispatch to the right action
    switch (payload.params.stype) {
        case 'deck':
            switch (payload.params.mode) {
                case 'view':
                    context.executeAction(loadDeckView, payloadCustom, done);
                    break;
                case 'edit':
                    context.executeAction(loadDeckEdit, payloadCustom, done);
                    break;
                case 'questions':
                    context.executeAction(loadContentQuestions, payloadCustom, done);
                    break;
                case 'datasources':
                    context.executeAction(loadDataSources, payloadCustom, done);
                    break;
                default:
                    context.executeAction(loadDeckView, payloadCustom, done);
            }
            break;
        case 'slide':
            switch (payload.params.mode) {
                case 'view':
                    context.executeAction(loadSlideView, payloadCustom, done);
                    break;
                case 'edit':
                    context.executeAction(loadSlideEdit, payloadCustom, done);
                    break;
                case 'questions':
                    context.executeAction(loadContentQuestions, payloadCustom, done);
                    break;
                case 'datasources':
                    context.executeAction(loadDataSources, payloadCustom, done);
                    break;
                default:
                    context.executeAction(loadSlideView, payloadCustom, done);
            }
            break;
        default:

    }
}
