import {shortTitle} from '../configs/general';
export default function loadContentHistory(context, payload, done) {
    context.service.read('history.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_CONTENT_HISTORY_FAILURE', err);
        } else {
            context.dispatch('LOAD_CONTENT_HISTORY_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Content History | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
