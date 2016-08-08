import {shortTitle} from '../configs/general';
export default function loadContentHistory(context, payload, done) {
    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined))
        console.log('Content type incorrect. Loading content history failed.');

    if (!(/^[0-9a-zA-Z-]+$/.test(payload.params.sid) || payload.params.sid === undefined))
        console.log('Slide id incorrect. Loading content history failed.');

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
