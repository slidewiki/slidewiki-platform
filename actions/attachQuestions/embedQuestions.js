import log from '../log/clog';

export default function embedQuestions(context,payload,done){
    log.info(context);
    
    let embedContent = payload;
    if (!embedContent.options.title){
        embedContent.options.title = 'Questions';
    }
       

    context.dispatch('SLIDE_EMBED_QUESTIONS', embedContent); //payload.questions and payload.options
    done();
}