const log = require('../log/clog');
import ContentQuestionsStore from '../../stores/ContentQuestionsStore';
import loadContentQuestions from '../loadContentQuestions';

export default function loadExamQuestions(context, payload, done) {
    log.info(context);
    const selector = context.getStore(ContentQuestionsStore).selector;
    const sid = (selector.sid) ? selector.sid.split('-')[0] : '';
    if (payload.params.sid.split('-')[0] !== sid || payload.params.stype !== selector.stype) {
        context.executeAction(loadContentQuestions, payload, done);
        // return;
    } else {
        done();
    }

}
