import {shortTitle} from '../../configs/general';
import UserProfileStore from '../../stores/UserProfileStore';
import { logger, breadcrumb} from '../../configs/log';
import serviceUnavailable from '../error/serviceUnavailable';

export default function addDeckSaveDeck(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    //enrich data
    if (payload.userid === undefined || payload.userid === null || payload.userid === '')
        payload.userid = context.getStore(UserProfileStore).userid;

    //no pptx uploaded
    if (payload.deckId === null) {
        context.service.create('deck.create', payload, null, {timeout: 30 * 1000}, (err, res) => {
            //console.log('Action addDeckSaveDeck: got', err, res);
            if (err) {
                logger.error({reqId: payload.navigate.reqId, err: err});
                context.executeAction(serviceUnavailable, payload, done);
                context.dispatch('CREATION_FAILURE', err);
            } else {
                context.dispatch('CREATION_SUCCESS', res);
            }
            done();
        });
    }
    else {
        context.service.update('deck.update', payload, null, {timeout: 30 * 1000}, (err, res) => {
            //console.log('Action addDeckSaveDeck: got', err, res);
            if (err) {
                logger.error({reqId: payload.navigate.reqId, err: err});
                context.executeAction(serviceUnavailable, payload, done);
                context.dispatch('CREATION_FAILURE', err);
            } else {
                context.dispatch('CREATION_SUCCESS', res);
            }
            done();
        });
    }
}
