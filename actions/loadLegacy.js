import serviceUnavailable from './error/serviceUnavailable';
import {navigateAction} from 'fluxible-router';
const log = require('./log/clog');

export default function loadLegacy(context, payload, done) {
    log.info(context);
    context.service.read('deck.legacy', {'oldid': parseInt(payload.params.oldid)}, {timeout: 20 * 1000}, (err, res) => {
        //  console.log('Executing loadPresentation action');
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_FEATURED_FAILURE', err);
        } else {
            done({'statusCode':'301','redirectURL': '/deck/' + res.new_id});
        }
    });
}
