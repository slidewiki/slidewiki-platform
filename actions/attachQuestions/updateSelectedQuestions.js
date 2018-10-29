import log from '../log/clog';

export default function updateSelectedQuestions(context,payload,done){
    log.info(context);
    context.dispatch('ATTACHQUESTIONS_SELECTED_QUESTIONS', payload);

    done();
}
