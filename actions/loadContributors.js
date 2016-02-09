import {shortTitle} from '../configs/general';
export default function loadContributors(context, payload, done) {
    context.service.read('contributors.list', payload, {timeout: 20 * 1000}, function (err, res) {
        if (err) {
            context.dispatch('LOAD_CONTRIBUTORS_FAILURE', err);
        } else {
            context.dispatch('LOAD_CONTRIBUTORS_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Contributors | ' + payload.params.ctype + ' | ' + payload.params.id;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
