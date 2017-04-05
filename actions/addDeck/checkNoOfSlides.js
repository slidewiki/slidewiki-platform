const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function checkNoOfSlides(context, payload, done) {
    log.info(context);
    context.service.read('deck.numberofslides', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            // context.dispatch('LOAD_SLIDE_ALL_FAILURE', err);
        } else {
            // console.log('actionRes', res);
            context.dispatch('SLIDES_PROGRESS', res);
        }

        done();
    });
}
