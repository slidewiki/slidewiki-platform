const log = require('../log/clog');

export default function transferOwnership(context, payload, done) {
    log.info(context);
    context.dispatch('TRY_TRANSFER_OWNERSHIP');
    context.service.update('deck.transferOwnership', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('TRANSFER_OWNERSHIP_ERROR', err);
        }
        else {
            context.dispatch('TRANSFER_OWNERSHIP_SUCCESS', res);
        }
        done();
    });
}
