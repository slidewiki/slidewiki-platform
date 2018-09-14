/*nikki need to change to questions? - where is this called from? */
/*nikki this code should retrieve the list of questions from the questions service, and then store them as deckQuestions in the attachQuestionsModalStore */
import log from '../log/clog';
import notFoundError from '../error/notFoundError';
import methodNotAllowedError  from '../error/methodNotAllowedError';
//import actions from the questions section??

export default function loadQuestions(context,payload,done){
    log.info(context);
    /*nikki need to change next line use questions.list? also questions.count? - only do questions.list if questions.count > 0? */
    /*nikki this payload coming in is the selector, but the selector is coming from the slide rather than the deck, so the sid is of the slide, which obviously has no questions */
    /*nikki need to get the deck level selector instead... */

    context.service.read('questions.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {

            if (err.statusCode === 404) {
                context.executeAction(notFoundError, {}, done);
                context.dispatch('ATTACHQUESTIONS_LOAD_QUESTIONS', []);
                return;
            } else if (err.statusCode === 401) {
                context.executeAction(methodNotAllowedError, {}, done);
                context.dispatch('ATTACHQUESTIONS_LOAD_QUESTIONS', []);
                return;
            } else{
                log.error(context, {filepath: __filename});
                context.dispatch('ATTACHQUESTIONS_LOAD_QUESTIONS', []);
            }
        } else { //Normal action
            context.dispatch('ATTACHQUESTIONS_LOAD_QUESTIONS', res);
        }
        done();
    });

}
