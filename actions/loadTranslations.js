import {shortTitle} from '../configs/general';
export default function loadTranslations(context, payload, done) {
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
