import {shortTitle} from '../configs/general';
export default function loadSlideContent(context, payload, done) {
    context.service.read('slide.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_SLIDE_CONTENT_FAILURE', err);
        } else {
            context.dispatch('LOAD_SLIDE_CONTENT_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Slide | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
