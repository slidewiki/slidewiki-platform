const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function downloadQuestion(context, payload, done) {

    
}
/*nikki  
export default function downloadQuestion(context, payload, done) {
    log.info(context);
    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)){
        context.executeAction(deckContentTypeError, payload, done);
        return;
    }

    context.service.read('questions.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            //log.info('err returned'); //nikki incorrect syntax?
            //log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            context.dispatch('DOWNLOAD_QUESTIONS_FAILURE', err);
        } else {
         //log.info(res);
            //context.dispatch('DOWNLOAD_QUESTIONS', {questions: res});
        }
        done();
    });
}
*/