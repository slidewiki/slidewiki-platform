import {shortTitle} from '../configs/general';
export default function loadSimilarContents(context, payload, done) {
    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined))
        console.log('Content type incorrect. Loading deck failed.');

    if (!(/^[0-9a-zA-Z-]+$/.test(payload.params.sid) || payload.params.sid === undefined))
        console.log('Slide id incorrect. Loading similar content failed.');


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
