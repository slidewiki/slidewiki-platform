import serviceUnavailable from './error/serviceUnavailable';
const log = require('./log/clog');

export default function loadFeatured(context, payload, done) {
    log.info(context);
    context.service.read('deck.featured', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_FEATURED_FAILURE', err);
        } else {
            context.dispatch('LOAD_FEATURED_SUCCESS', res);
        }
        done();
    });
}
