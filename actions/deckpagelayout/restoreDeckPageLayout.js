import { logger, breadcrumb} from '../../configs/log';

export default function restoreDeckPageLayout(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    context.dispatch('RESTORE_DECK_PAGE_LAYOUT', payload);
    context.dispatch('UPDATE_DECK_VIEW_PANEL_HEIGHT', 0);
    done();
}
