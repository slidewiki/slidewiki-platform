const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function checkNoOfSlides(context, payload, done) {
    log.info(context);
    context.service.read('decktree.nodes', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('SLIDES_PROGRESS', {slides: []});
        } else {
            context.dispatch('SLIDES_PROGRESS', {slides: res.deckTree.children});
        }

        done();
    });
}
