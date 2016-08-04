import {shortTitle} from '../configs/general';
export default function loadContributors(context, payload, done) {
    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined))
        console.log('Content type incorrect. Loading contributors failed.');

    if (!(/^[0-9a-zA-Z]+$/.test(payload.params.sid) || payload.params.sid === undefined))
        console.log('Slide id incorrect. Loading contributors failed.');

    context.service.read('contributors.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_CONTRIBUTORS_FAILURE', err);
        } else {
            context.dispatch('LOAD_CONTRIBUTORS_SUCCESS', res);
            context.dispatch('UPDATE_MODULE_TYPE_SUCCESS', {moduleType: 'contributors'});
        }
        let pageTitle = shortTitle + ' | Contributors | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
