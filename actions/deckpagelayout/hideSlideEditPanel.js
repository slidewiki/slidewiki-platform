const log = require('../log/clog');

export default function hideSlideEditPanel(context, payload, done) {
    log.info(context);
    context.dispatch('HIDE_SLIDE_EDIT_PANEL', payload);
    done();
}
