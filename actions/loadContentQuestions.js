import { shortTitle } from '../configs/general';
import deckContentTypeError from './error/deckContentTypeError';
import slideIdTypeError from './error/slideIdTypeError';
import { AllowedPattern } from './error/util/allowedPattern';
import serviceUnavailable from './error/serviceUnavailable';
const log = require('./log/clog');
const maxQuestions = 5; // number of questions per page
const pageNum = 1; // pagination

export default function loadContentQuestions(context, payload, done) {
    log.info(context);
    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)){
        context.executeAction(deckContentTypeError, payload, done);
        return;
    }

    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    payload.params.maxQ = payload.params.maxQ === undefined || parseInt(payload.params.maxQ) === 'NaN' ? maxQuestions : payload.params.maxQ;
    payload.params.pageNum = payload.params.pageNum === undefined || parseInt(payload.params.pageNum) === 'NaN' ? pageNum : payload.params.pageNum;
    
    context.service.read('questions.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_CONTENT_QUESTIONS_FAILURE', err);
        } else {
            context.dispatch('LOAD_CONTENT_QUESTIONS_SUCCESS', res);
            context.dispatch('UPDATE_MODULE_TYPE_SUCCESS', {moduleType: 'questions'});
        }
        let pageTitle = shortTitle + ' | Content Questions | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
