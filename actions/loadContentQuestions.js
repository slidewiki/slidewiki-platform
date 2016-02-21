import {shortTitle} from '../configs/general';
export default function loadContentQuestions(context, payload, done) {
    context.service.read('questions.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_CONTENT_QUESTIONS_FAILURE', err);
        } else {
            context.dispatch('LOAD_CONTENT_QUESTIONS_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Content Questions | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
