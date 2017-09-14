const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function addQuestion(context, payload, done) {
    log.info(context, payload);
    context.service.create('questions.add', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            //context.executeAction(serviceUnavailable, payload, done);
            context.dispatch('LOAD_CONTENT_MODULES_SUCCESS', {moduleType: 'question', selector:payload.question.selector});
        } else {
            context.dispatch('LOAD_CONTENT_MODULES_SUCCESS', {moduleType: 'question', selector:payload.question.selector});
            context.dispatch('UPDATE_MODULE_TYPE_SUCCESS', {moduleType: 'questions'});
        }
        done();
    });
}
