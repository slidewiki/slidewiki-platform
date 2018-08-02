const log = require('../log/clog');

export default function validateUsedLanguage(context, payload, done) {
    log.info(context);

    context.dispatch('TRANSLATION_VALIDATE_LANGUAGE', payload.language);
    done();
}
