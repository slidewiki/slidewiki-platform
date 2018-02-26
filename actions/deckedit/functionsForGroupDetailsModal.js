const log = require('../../log/clog');

export function showGroupDetailsModal(context, payload, done) {
    log.info(context);
    context.dispatch('SHOW_GROUP_DETAILS_MODAL', {});
    done();
}

export function hideGroupDetailsModal(context, payload, done) {
    log.info(context);
    context.dispatch('HIDE_GROUP_DETAILS_MODAL', {});
    done();
}
