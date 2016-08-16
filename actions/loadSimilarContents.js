import { shortTitle } from '../configs/general';
import { deckContentTypeError, slideIdTypeError } from './loadErrors';

export default function loadSimilarContents(context, payload, done) {
    if(!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)) {
        context.executeAction(deckContentTypeError, payload).catch((err) => {done(err);});
        return;
    }

    if(!(/^[0-9a-zA-Z-]+$/.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload).catch((err) => {done(err);});
        return;
    }

    context.service.read('similarcontent.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_SIMILAR_CONTENT_FAILURE', err);
        } else {
            context.dispatch('LOAD_SIMILAR_CONTENT_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Similar Content | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
