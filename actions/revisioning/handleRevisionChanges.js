import {shortTitle} from '../../configs/general';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function handleRevisionChanges(context, payload, done) {
    context.service.read('deck.handleRevisionChanges', payload, {}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('ERROR_UPDATE_REVISIONING_RESULT', err); // not implemented in store
        } else {
            context.dispatch('UPDATE_REVISIONING_RESULT', res);
        }
        done();
    });
}
