const log = require('../log/clog');
const maxQuestions = 100; // number of questions per page
const pageNum = 1; // pagination

export default function loadDeckQuality(context, payload, done) {
    log.info(context);
    context.dispatch('UPDATE_MODULE_TYPE_SUCCESS', {moduleType: 'quality'});

    // questions are also evaluated in the quality check, so let's fetch them 
    payload.params.maxQ = payload.params.maxQ === undefined || parseInt(payload.params.maxQ) === 'NaN' ? maxQuestions : payload.params.maxQ;
    payload.params.pageNum = payload.params.pageNum === undefined || parseInt(payload.params.pageNum) === 'NaN' ? pageNum : payload.params.pageNum;

    context.service.read('questions.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('LOAD_CONTENT_QUESTIONS_SUCCESS', res);
        }

        done();
    });

}
