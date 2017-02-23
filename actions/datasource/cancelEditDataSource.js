const log = require('../log/clog');

export default function cancelEditDataSource(context, payload, done) {
    log.info(context);
    context.dispatch('CANCEL_EDIT_DATASOURCE');
    done();
}
