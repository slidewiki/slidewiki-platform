import {shortTitle} from '../../configs/general';
export default function loadSlideEdit(context, payload, done) {
    console.log(payload);
    context.service.read('slide.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_SLIDE_EDIT_FAILURE', err);
        } else {
            context.dispatch('LOAD_SLIDE_EDIT_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Slide Edit | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
