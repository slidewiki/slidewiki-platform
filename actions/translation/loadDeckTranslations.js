const log = require('../log/clog');
import UserProfileStore from '../../stores/UserProfileStore';

export default function loadDeckTranslation(context, payload, done) {
    log.info(context);

    payload.jwt = context.getStore(UserProfileStore).getState().jwt;//TODO is jwt needed?

    context.service.read('deck.translations', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);//TODO improve
            return;
        } else {
            context.dispatch('LOAD_DECK_TRANSLATIONS_SUCCESS', res);
        }
        done();
    });
}
