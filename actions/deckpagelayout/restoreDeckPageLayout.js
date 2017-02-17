const log = require('../log/clog');

export default function restoreDeckPageLayout(context, payload, done) {
    log.info(context, payload);
    context.dispatch('RESTORE_DECK_PAGE_LAYOUT', payload);
    context.dispatch('UPDATE_DECK_VIEW_PANEL_HEIGHT', 0);
    done();
}
