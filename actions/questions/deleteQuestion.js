const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function deleteQuestion(context, payload, done) {
    log.info(context, payload);
    context.service.delete('questions.delete', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            context.dispatch('DELETE_QUESTION_FAILED');
        } else {
            context.dispatch('DELETE_QUESTION', res);
        }
        done();
    });
}
