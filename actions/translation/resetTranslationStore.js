
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function updateTranslationStore(context, payload, done) {
    log.info(context);
    context.dispatch('RESET_TRANSLATION_STORE');
}
