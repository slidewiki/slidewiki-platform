const log = require('../log/clog');

export default function hideNoPermissionsModal(context, payload, done) {
    context.dispatch('HIDE_NO_PERMISSIONS_MODAL');
    done();
}
