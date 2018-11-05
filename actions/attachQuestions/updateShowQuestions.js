import log from '../log/clog';

export default function updateShowQuestions(context,payload,done){
    log.info(context);
    context.dispatch('ATTACHQUESTIONS_SHOW_QUESTIONS', payload);

    done();
}
