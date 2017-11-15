const log = require('../log/clog');

export default function showSlideEditPanel(context, payload, done) {
    log.info(context);
    context.dispatch('SHOW_SLIDE_EDIT_PANEL', payload);
    done();
}
