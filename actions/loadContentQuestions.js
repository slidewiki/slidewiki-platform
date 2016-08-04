import {shortTitle} from '../configs/general';
export default function loadContentQuestions(context, payload, done) {
    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined))
        console.log('Content type incorrect. Loading content question failed.');

    if (!(/^[0-9a-zA-Z]+$/.test(payload.params.sid) || payload.params.sid === undefined))
        console.log('Slide id incorrect. Loading content question failed.');

    context.service.read('questions.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_CONTENT_QUESTIONS_FAILURE', err);
        } else {
            context.dispatch('LOAD_CONTENT_QUESTIONS_SUCCESS', res);
            context.dispatch('UPDATE_ACTIVITY_TYPE_SUCCESS', {activityType: 'questions'});
        }
        let pageTitle = shortTitle + ' | Content Questions | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
