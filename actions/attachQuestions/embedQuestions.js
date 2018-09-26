import log from '../log/clog';

export default function embedQuestions(context,payload,done){
    log.info(context);
    //payload is the selectedQuestions
    /*nikki would this have another layer which was params? like in the DownloadQuestions action? */
    //would also need to include the options
    //let questions = payload.questions;
    //let options = payload.options; //this will have multiple options in it

    /*nikki need some error handling here */


    let questionsList = payload.questions;
    //let uniqueID = this.getuniqueID();
    let title = payload.title;
    let htmlstart = '<div _id="questions_title" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid h-mid" style="position: absolute; top: 20px; left: 66px; width: 828px; height: 100px; z-index: 23488;">'+
    ' <h3>'+title+'</h3></div>'; /*nikki what is _idx? _name _type*/

    let html = '<div id="embedded_slide_questions" style="position: absolute; top: 120px; left: 66px; width: 828px; height: 456.833px; z-index: 23520; font-family:sans-serif;">'; //would need aria elements /*nikki should the start and end just be the iframe tags? */
    

    for (let i = 0; i < questionsList.length; i++){
        let currentQuestion = questionsList[i];
        let currentAnswers = currentQuestion.answers;
        html += '<div class="slide_question"><div>' + currentQuestion.title + '</div>'; // does this have css?
        
        for (let j = 0; j < currentAnswers.length; j++){
            html += '<input type="checkbox" name="answer' + j + '" value="' + currentAnswers[j].answer + '">' + currentAnswers[j].answer + '</br>' ;
        }
        html += '</br></div>';
    }

    let htmlend = '</div>';
    //let iframe = '<iframe width="800" height="400" srcdoc="'+ html + '"></iframe>';

    context.dispatch('CHANGE_TEMPLATE', {
        template: 'questions',
        templateQuestionsContent: {
            title: 'contenty content',
            htmlstart: htmlstart,
            html: html,
            htmlend: htmlend,
        },
    });

    done();
}