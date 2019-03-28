const log = require('../log/clog');

export default function hideTransferOwnershipModal(context, payload, done) {
    log.info(context);
    context.dispatch('HIDE_TRANSFER_OWNERSHIP_MODAL', {});
    done();
}
