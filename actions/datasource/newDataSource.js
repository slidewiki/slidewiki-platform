const log = require('../log/clog');

export default function newDataSource(context, payload, done) {
    log.info(context, payload);
    context.dispatch('NEW_DATASOURCE');
}
