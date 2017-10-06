const log = require('../log/clog');

export default function showEditInProgressModal(context, payload, done) {
    context.dispatch('SHOW_EDIT_IN_PROGRESS_MODAL', payload);
}
