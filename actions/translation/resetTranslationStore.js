const log = require('../log/clog');

export default function resetTranslationStore(context, payload, done) {
    log.info(context);

    context.dispatch('TRANSLATION_RESET', payload.language);
    done();
}
