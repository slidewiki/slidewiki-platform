const log = require('../log/clog');

export default function hideEditInProgressModal(context, payload, done) {
    context.dispatch('HIDE_EDIT_IN_PROGRESS_MODAL');
}
