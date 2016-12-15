const clog = require('../log/clog');

export default function showMoreDataSources(context, payload, done) {
    clog.info(context, payload);
    context.dispatch('SHOW_ALL_DATASOURCES');
}
