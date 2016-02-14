import {shortTitle} from '../configs/general';
import loadDeckContent from './loadDeckContent';
import loadSlideContent from './loadSlideContent';

export default function loadContent(context, payload, done) {
    context.dispatch('UPDATE_CONTENT', payload);
    //dispatch to the right action
    switch (payload.params.stype) {
        case 'deck':
            switch (payload.params.mode) {
                case 'view':
                    context.executeAction(loadDeckContent, payload, done);
                    break;
                case 'edit':

                    break;
                default:
                    context.executeAction(loadDeckContent, payload, done);
            }
            break;
        case 'slide':
            switch (payload.params.mode) {
                case 'view':
                    context.executeAction(loadSlideContent, payload, done);
                    break;
                case 'edit':

                    break;
                default:
                    context.executeAction(loadSlideContent, payload, done);
            }
            break;
        default:

    }
}
