import {shortTitle} from '../configs/general';
import {ErrorsList} from '../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export default function loadContentHistory(context, payload, done) {
    if(!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)) {
        let error = fumblle.http.badRequest();
        context.dispatch('DECK_ERROR', ErrorsList.DECK_CONTENT_TYPE_ERROR);
        throw error;
    }

    if(!(/^[0-9a-zA-Z-]+$/.test(payload.params.sid) || payload.params.sid === undefined)) {
        let error = fumble.http.badRequest();
        context.dispatch('SLIDE_ERROR', ErrorsList.SLIDE_ID_TYPE_ERROR);
        throw error;
    }

    context.service.read('history.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_CONTENT_HISTORY_FAILURE', err);
        } else {
            context.dispatch('LOAD_CONTENT_HISTORY_SUCCESS', res);
            context.dispatch('UPDATE_MODULE_TYPE_SUCCESS', {moduleType: 'history'});
        }
        let pageTitle = shortTitle + ' | Content History | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
