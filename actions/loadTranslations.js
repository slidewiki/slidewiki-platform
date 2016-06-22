import {shortTitle} from '../configs/general';
export default function loadTranslations(context, payload, done) {
    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined))
        console.log("Content type incorrect. Loading translations failed.");

    if (!(/^[0-9a-zA-Z]+$/.test(payload.params.sid) || payload.params.sid === undefined))
        console.log("Slide id incorrect. Loading translations failed.");

    context.service.read('translation.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_TRANSLATIONS_FAILURE', err);
        } else {
            context.dispatch('LOAD_TRANSLATIONS_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Translations | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
