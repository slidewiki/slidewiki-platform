const log = require('../log/clog');

export default function changeEditMode(context, payload, done) {
    log.info(context);
    context.dispatch('CHANGE_EDIT_MODE', payload);
    done();
}
