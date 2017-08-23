const log = require('../log/clog');

export default function showNoPermissionsModal(context, payload, done) {
    context.dispatch('SHOW_NO_PERMISSIONS_MODAL');
}
