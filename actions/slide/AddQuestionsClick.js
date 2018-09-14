import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function AddQuestionsClick(context, payload, done) {
    log.info(context);
    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)){
        context.executeAction(deckContentTypeError, payload, done);
        return;
    }

    context.service.read('questions.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('ADD_QUESTIONS_CLICK_FAILURE', err);
        } else {
            context.dispatch('ADD_QUESTIONS_CLICK', {questions: res});
        }
        done();
    });
}
/*nikki is this needed anymore??? */