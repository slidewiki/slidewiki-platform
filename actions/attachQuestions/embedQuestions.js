import log from '../log/clog';

export default function embedQuestions(context,payload,done){
    log.info(context);
    /*nikki would this have another layer which was params? like in the DownloadQuestions action? */
    
    /*nikki need some error handling here - for what?*/
    let embedContent = payload;
    if (!embedContent.options.title){
        embedContent.options.title = 'Questions';
    }
   // console.log(payload);
   /* let questionsList = payload.questions;
    //let uniqueID = this.getuniqueID();
    //let title = 'example';
    let title = '';
    if (payload.options.title){
        title = payload.options.title;
    }else {
        title = 'Questions';
    }
    */
    

    context.dispatch('SLIDE_EMBED_QUESTIONS', embedContent); //payload.questions and payload.options
    done();
}