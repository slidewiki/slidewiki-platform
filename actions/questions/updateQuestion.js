const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function saveQuestion(context, payload, done) {
    log.info(context, payload);
    context.dispatch('SAVE_QUESTION', payload);
    context.service.update('questions.update', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            context.dispatch('SAVE_QUESTION_FAILED');
        } else {
            context.dispatch('SAVE_QUESTION', res);
        }
        done();
    });
}
