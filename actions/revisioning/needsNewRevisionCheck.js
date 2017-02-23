import {shortTitle} from '../../configs/general';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function needsNewRevisionCheck(context, payload, done) {
    context.service.read('deck.needsNewRevision', payload, {}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('ERROR_UPDATE_REVISIONING_STATUS', err); // not implemented in store
        } else {
            context.dispatch('UPDATE_REVISIONING_STATUS', res);
        }
        done();
    });
}
