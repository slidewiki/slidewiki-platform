import log from '../log/clog';
export default function selectExamAnswer(context, payload, done) {
    log.info(context);
    context.dispatch('QUESTION_ANSWER_SELECTED', payload);
    done();
}
