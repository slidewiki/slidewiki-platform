const log = require('../log/clog');

export default function changeCurrentLanguage(context, payload, done) {
    log.info(context);

    context.dispatch('TRANSLATION_CHANGE_CURRENT_LANGUAGE', payload.language);
    done();
}
