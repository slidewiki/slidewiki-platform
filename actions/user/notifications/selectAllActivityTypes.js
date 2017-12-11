const log = require('../../log/clog');

export default function selectAllActivityTypes(context, payload, done) {
    log.info(context);
    context.dispatch('SELECT_ALL_ACTIVITY_TYPES', payload);
    done();
}
