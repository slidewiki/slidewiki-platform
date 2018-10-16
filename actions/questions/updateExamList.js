const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import ContentQuestionsStore from '../../stores/ContentQuestionsStore';

export default function updateExamList(context, payload, done) {
    log.info(context, payload);
    
    context.service.update('questions.updateExamList', {modifiedSelections: payload.modifiedSelections}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('UPDATE_QUESTIONS', payload);
        }
        done();
    });
}
