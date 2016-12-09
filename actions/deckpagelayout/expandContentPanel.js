import { logger, breadcrumb} from '../../configs/log';

export default function expandContentPanel(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    context.dispatch('EXPAND_CONTENET_PANEL', payload);
    context.dispatch('UPDATE_DECK_VIEW_PANEL_HEIGHT', 1);
    done();
}
