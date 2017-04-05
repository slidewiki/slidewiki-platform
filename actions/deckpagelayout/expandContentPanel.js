const log = require('../log/clog');

export default function expandContentPanel(context, payload, done) {
    log.info(context);
    context.dispatch('EXPAND_CONTENET_PANEL', payload);
    context.dispatch('UPDATE_DECK_VIEW_PANEL_HEIGHT', 1);
    done();
}
