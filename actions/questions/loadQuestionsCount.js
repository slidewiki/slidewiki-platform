export default function loadQuestionsCount(context, payload, done) {
    context.service.read('questions.count', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_AMOUNT_OF_QUESTIONS_FAILURE', err);
        } else {
            context.dispatch('LOAD_AMOUNT_OF_QUESTIONS_SUCCESS', res);
        }

        done();
    });

}
