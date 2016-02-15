import {shortTitle} from '../configs/general';
import loadDeckContent from './loadDeckContent';
import loadSlideContent from './loadSlideContent';

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
                    context.executeAction(loadDeckContent, payloadCustom, done);
                    break;
                case 'edit':
                    done();
                    break;
                default:
                    context.executeAction(loadDeckContent, payloadCustom, done);
            }
            break;
        case 'slide':
            switch (payload.params.mode) {
                case 'view':
                    context.executeAction(loadSlideContent, payloadCustom, done);
                    break;
                case 'edit':
                    done();
                    break;
                default:
                    context.executeAction(loadSlideContent, payloadCustom, done);
            }
            break;
        default:

    }
}
