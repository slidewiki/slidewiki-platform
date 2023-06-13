const log = require('./log/clog');

export default function loadQuestionAnswers(context, payload, done) {
    log.info(context);

    if (!payload.query.question) {
        done();
        return;
    }

    context.dispatch('QUESTION_ANSWERING_SET_IS_LOADING', true);
    context.dispatch('QUESTION_ANSWERING_SET_ANSWERS', []);
    context.dispatch('QUESTION_ANSWERING_SET_QUESTION', payload.query.question);
    context.dispatch('QUESTION_ANSWERING_SET_HAS_ERROR_OCCURRED', false);

    context.service.read('questionAnswering', payload.query, { timeout: 30 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('QUESTION_ANSWERING_SET_HAS_ERROR_OCCURRED', true);
            context.dispatch('QUESTION_ANSWERING_SET_IS_LOADING', false);
            context.dispatch('QUESTION_ANSWERING_SET_ANSWERS', []);

        } else {
            context.dispatch('QUESTION_ANSWERING_SET_IS_LOADING', false);
            context.dispatch('QUESTION_ANSWERING_SET_HAS_ERROR_OCCURRED', false);

            if (!res) {
                done();
                return;
            }
    
            context.dispatch('QUESTION_ANSWERING_SET_ANSWERS', res.answers);
            done();
        }

    });
}
