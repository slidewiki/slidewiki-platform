import log from '../log/clog';

export default function updateOptions(context,payload,done){
    log.info(context);
    context.dispatch('ATTACHQUESTIONS_UPDATE_OPTIONS', payload);
    //should be in the form {option: 'title'/'showAnswers'/'showExplanation', value: xxx}
    done();
}