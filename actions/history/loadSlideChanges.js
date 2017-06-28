const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function loadSlideChanges(context, payload, done) {
    log.info(context);
    context.service.read('history.changes', {deckId: payload.deckId, slideId: payload.slideId}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('LOAD_SLIDE_CHANGES_SUCCESS', {changes: res, slideId: payload.slideId});
        }
        done();
    });
}
