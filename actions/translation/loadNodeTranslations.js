const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function loadNodeTranslations(context, payload, done) {
    log.info(context);

    context.service.read('decktree.nodetranslation', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('LOAD_TRANSLATIONS_SUCCESS', res);
            done(null, res.selector);
        }
    });
}
