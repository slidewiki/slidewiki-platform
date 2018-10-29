const log = require('../log/clog');
import ContentQuestionsStore from '../../stores/ContentQuestionsStore';
import deckContentTypeError from '../error/deckContentTypeError';
import serviceUnavailable from '../error/serviceUnavailable';
import slideIdTypeError from '../error/slideIdTypeError';
import { AllowedPattern } from '../error/util/allowedPattern';
export default function loadExamQuestions(context, payload, done) {
    log.info(context);
    const selector = context.getStore(ContentQuestionsStore).selector;
    const sid = (selector.sid) ? selector.sid.split('-')[0] : '';
    if (payload.params.sid.split('-')[0] !== sid || payload.params.stype !== selector.stype) {
      
        if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)){
            context.executeAction(deckContentTypeError, payload, done);
            return;
        }

        if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
            context.executeAction(slideIdTypeError, payload, done);
            return;
        }
        
        context.service.read('questions.examlist', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);
            } else {
                context.dispatch('LOAD_CONTENT_QUESTIONS_SUCCESS', res);
                context.dispatch('UPDATE_MODULE_TYPE_SUCCESS', {moduleType: 'questions'});
            }
            
            done();
        });
    } else {
        done();
    }
}
