import log from '../log/clog';
import notFoundError from '../error/notFoundError';
import methodNotAllowedError  from '../error/methodNotAllowedError';
//import actions from the questions section??

export default function loadQuestions(context,payload,done){
    log.info(context);
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
