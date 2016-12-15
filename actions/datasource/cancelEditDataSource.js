const clog = require('../log/clog');

export default function cancelEditDataSource(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('CANCEL_EDIT_DATASOURCE');
    done();
}
