import {shortTitle} from '../configs/general';
export default function loadContentUsage(context, payload, done) {
    context.service.read('usage.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_CONTENT_USAGE_FAILURE', err);
        } else {
            context.dispatch('LOAD_CONTENT_USAGE_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Content Usage | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
