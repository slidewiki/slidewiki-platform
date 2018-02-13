const log = require('../../log/clog');

export function showDeactivateAccountModal(context, payload, done) {
    log.info(context);
    context.dispatch('SHOW_DEACTIVATE_ACCOUNT_MODAL', {});
    done();
}

export function hideDeactivateAccountModal(context, payload, done) {
    log.info(context);
    context.dispatch('HIDE_DEACTIVATE_ACCOUNT_MODAL', {});
    done();
}
