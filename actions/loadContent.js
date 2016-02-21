import {shortTitle} from '../configs/general';
import loadDeckView from './loadDeckView';
import loadDeckEdit from './loadDeckEdit';
import loadSlideView from './loadSlideView';
import loadSlideEdit from './loadSlideEdit';
import loadContentHistory from './loadContentHistory';
import loadContentUsage from './loadContentUsage';
import loadContentQuestions from './loadContentQuestions';
import loadContentDiscussion from './loadContentDiscussion';

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
                case 'history':
                    context.executeAction(loadContentHistory, payloadCustom, done);
                    break;
                case 'usage':
                    context.executeAction(loadContentUsage, payloadCustom, done);
                    break;
                case 'questions':
                    context.executeAction(loadContentQuestions, payloadCustom, done);
                    break;
                case 'discussion':
                    context.executeAction(loadContentDiscussion, payloadCustom, done);
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
                case 'history':
                    context.executeAction(loadContentHistory, payloadCustom, done);
                    break;
                case 'usage':
                    context.executeAction(loadContentUsage, payloadCustom, done);
                    break;
                case 'questions':
                    context.executeAction(loadContentQuestions, payloadCustom, done);
                    break;
                case 'discussion':
                    context.executeAction(loadContentDiscussion, payloadCustom, done);
                    break;
                default:
                    context.executeAction(loadSlideView, payloadCustom, done);
            }
            break;
        default:

    }
}
