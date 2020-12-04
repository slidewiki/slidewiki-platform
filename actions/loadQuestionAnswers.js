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

    context.service.read('questionAnswering', payload.query, { timeout: 20 * 1000 }, (err, res) => {
        context.dispatch('QUESTION_ANSWERING_SET_IS_LOADING', false);

        if (!res) {
            done();
            return;
        }

        context.dispatch('QUESTION_ANSWERING_SET_ANSWERS', res.answers);
        done();
    });
}
