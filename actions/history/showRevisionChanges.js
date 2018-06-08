const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import TranslationStore from '../../stores/TranslationStore';

export default function showRevisionChanges(context, payload, done) {
    log.info(context);
    let language = context.getStore(TranslationStore).currentLang;
    context.service.read('history.changes', {deckId: payload.deckId + '-' + payload.revisionId, language}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('LOAD_DECK_CHANGES_SUCCESS', {changes: res, revisionId: payload.revisionId});
            context.dispatch('SHOW_REVISION_CHANGES', payload);
        }
        done();
    });
}
