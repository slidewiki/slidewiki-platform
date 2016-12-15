const clog = require('../log/clog');

export default function newDataSource(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('NEW_DATASOURCE');
}
