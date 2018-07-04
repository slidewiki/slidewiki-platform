const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function loadDeckTranslations(context, payload, done) {
    log.info(context);

    context.service.read('deck.translations', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);//TODO improve
            return;
        } else {
            if (res && res[0] && res[0].language) {
                // just the strings of the translations not the primary language
                res = res.filter((t) => !t.original).map((t) => t.language);
            }
            context.dispatch('LOAD_DECK_TRANSLATIONS_SUCCESS', res);
        }
        done();
    });
}
