import { logger, breadcrumb} from '../../configs/log';

export default function checkNewRevisionNeeded(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    let selector = payload.selector;
    let tmp = selector.spath.split(';');
    let targetDeckID;
    if (tmp.length > 1) {
        targetDeckID = tmp[tmp.length - 2];
        tmp = targetDeckID.split(':');
        targetDeckID = tmp[0];
    } else {
        //target is root deck
        targetDeckID = selector.id;
    }
    context.service.read('deck.needsNewRevision', {
        deckID: targetDeckID,
        userID: payload.userid
    }, {}, done);
}
