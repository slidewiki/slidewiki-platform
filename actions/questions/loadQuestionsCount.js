const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function loadQuestionsCount(context, payload, done) {
    log.info(context);
    context.service.read('questions.count', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_AMOUNT_OF_QUESTIONS_FAILURE', err);
        } else {
            context.dispatch('LOAD_AMOUNT_OF_QUESTIONS_SUCCESS', res);
        }

        done();
    });

}
