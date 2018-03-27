import log from '../log/clog';

export default function showCorrectExamAnswers(context, payload, done) {
    log.info(context);
    context.dispatch('SHOW_CORRECT_EXAM_ANSWERS', payload);
    done();
}
