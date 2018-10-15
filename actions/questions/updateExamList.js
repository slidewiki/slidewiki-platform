const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import ContentQuestionsStore from '../../stores/ContentQuestionsStore';

export default function updateExamList(context, payload, done) {
    log.info(context, payload);
    
    let modifiedQuestions = [];
    let questionsFromStore = context.getStore(ContentQuestionsStore).questions;
    for(let i = 0; i < questionsFromStore.length; i++) {
        if (questionsFromStore[i].isExamQuestion !== this.props.items[i].isExamQuestion) {
            modifiedQuestions.push({id: this.props.items[i].id, is_exam_question: this.props.items[i].is_exam_question});
        }
    }
    
    context.service.update('questions.updateExamList', {modifiedQuestions: modifiedQuestions}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('UPDATE_QUESTIONS', payload);
        }
        done();
    });
}
