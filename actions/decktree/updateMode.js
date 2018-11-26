const log = require('../log/clog');

export default function updateMode(context, payload, done) {
    log.info(context);
    context.dispatch('UPDATE_MODE', payload);
    done();
}
