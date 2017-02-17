const log = require('../log/clog');

export default function showMoreDataSources(context, payload, done) {
    log.info(context, payload);
    context.dispatch('SHOW_ALL_DATASOURCES');
}
