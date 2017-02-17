const log = require('../log/clog');

export default function cancelEditDataSource(context, payload, done) {
    log.info(context, payload);
    context.dispatch('CANCEL_EDIT_DATASOURCE');
    done();
}
