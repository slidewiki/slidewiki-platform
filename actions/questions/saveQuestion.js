const log = require('../log/clog');

export default function saveQuestion(context, payload, done) {
    log.info(context, payload);
    context.dispatch('SAVE_QUESTION', payload);
    context.service.read('questions.save', payload, {timeout: 20 * 1000}, (err, res) => {
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
