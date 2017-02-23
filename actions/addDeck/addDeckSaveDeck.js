import {shortTitle} from '../../configs/general';
import UserProfileStore from '../../stores/UserProfileStore';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function addDeckSaveDeck(context, payload, done) {
    log.info(context);
    //enrich data
    if (payload.userid === undefined || payload.userid === null || payload.userid === '')
        payload.userid = context.getStore(UserProfileStore).userid;

    //no pptx uploaded
    if (payload.deckId === null) {
        context.service.create('deck.create', payload, null, {timeout: 30 * 1000}, (err, res) => {
            //console.log('Action addDeckSaveDeck: got', err, res);
            if (err) {
                log.error(context, {filepath: __filename, err: err});
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
                log.error(context, {filepath: __filename, err: err});
                context.executeAction(serviceUnavailable, payload, done);
                context.dispatch('CREATION_FAILURE', err);
            } else {
                context.dispatch('CREATION_SUCCESS', res);
            }
            done();
        });
    }
}
