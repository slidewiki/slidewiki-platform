const log = require('../log/clog');

export default function resetPermissions(context, payload, done) {
    context.dispatch('RESET_PERMISSIONS_SUCCESS', {deckId: payload.params.id});
    done();
}
