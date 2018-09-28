import log from '../log/clog';

export default function embedQuestions(context,payload,done){
    log.info(context);
    /*nikki would this have another layer which was params? like in the DownloadQuestions action? */
    //would also need to include the options
    //let questions = payload.questions;
    //let options = payload.options; //this will have multiple options in it

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
    //move this into the SlideContentEditor
    let htmlstart = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative;  transform-origin: left top 0px;"><div id="questions_title" _type="title" class="block content v-mid h-mid" style="position: absolute; top: 20px; left: 66px; width: 828px; height: 100px;">'+
    ' <h3>'+title+'</h3></div>'; 
    //style="position: absolute; top: 20px; left: 66px; width: 828px; height: 100px; z-index: 23488;"
    let html = '<div id="embedded_slide_questions" style="position: relative; top: 100px; left: 66px; font-family:sans-serif;">'; //would need aria elements //nikki should the start and end just be the iframe tags? 
    //position: absolute; top: 120px; left: 66px; width: 828px; height: 456.833px; z-index: 23520;

    for (let i = 0; i < questionsList.length; i++){
        let currentQuestion = questionsList[i];
        let currentAnswers = currentQuestion.answers;
        html += '<div class="slide_question"><div>' + currentQuestion.title + '</div>'; // does this have css?
        
        for (let j = 0; j < currentAnswers.length; j++){
            html += '<input type="checkbox" name="answer' + j + '" value="' + currentAnswers[j].answer + '">' + currentAnswers[j].answer + '</br>' ;
        } //change away from checkbox
        html += '</br></div>';
    }

    let htmlend = '</div></div>';
    //let iframe = '<iframe width="800" height="400" srcdoc="'+ html + '"></iframe>';
    */

/*    context.dispatch('CHANGE_TEMPLATE', {
        template: 'questions',
        templateQuestionsContent: {
            //title: 'contenty content',
            htmlstart: htmlstart,
            html: html,
            htmlend: htmlend,
        },
    });*/
    context.dispatch('SLIDE_EMBED_QUESTIONS', embedContent); //payload.questions and payload.options
    done();
}