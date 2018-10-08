import log from '../log/clog';
import notFoundError from '../error/notFoundError';
import methodNotAllowedError  from '../error/methodNotAllowedError';

/*nikki no longer needed - service modified instead */
export default function getQuestionsCount(context,payload,done){
    /*nikki trying to pull back the questions count so it can be displayed in the search results */
    log.info(context);

    context.service.read('questions.count', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {

            if (err.statusCode === 404) {
                context.executeAction(notFoundError, {}, done);
                //context.dispatch('ATTACHQUESTIONS_LOAD_QUESTIONS', []);
                return;
            } else if (err.statusCode === 401) {
                context.executeAction(methodNotAllowedError, {}, done);
                //context.dispatch('ATTACHQUESTIONS_LOAD_QUESTIONS', []);
                return;
            } else{
                log.error(context, {filepath: __filename});
                //context.dispatch('ATTACHQUESTIONS_LOAD_QUESTIONS', []);
            }
        } else { //Normal action
            context.dispatch('ATTACHQUESTIONS_QUESTIONS_COUNT', res);
            return res;
        
        }
        done();
    });

}