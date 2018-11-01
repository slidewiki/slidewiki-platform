import log from '../log/clog';
export default function resetExamAnswers(context, payload, done) {
    log.info(context);
    context.dispatch('RESET_ANSWERS', payload);
    done();
}
