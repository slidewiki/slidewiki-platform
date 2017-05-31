const log = require('../log/clog');

export default function mailShareShowWrongFields(context, payload, done) {
    log.info(context);
    context.dispatch('MAIL_SHARE_SHOW_WRONG_FIELDS', payload);
    done();
}
