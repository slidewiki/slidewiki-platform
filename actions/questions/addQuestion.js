const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function addQuestion(context, payload, done) {
    log.info(context, payload);
    context.service.create('questions.add', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            context.dispatch('ADD_QUESTION_FAILED');
        } else {
            context.dispatch('ADD_QUESTION', res);
        }
        done();
    });
}
