import {shortTitle} from '../../configs/general';
import {ErrorsList} from '../../components/Error/util/ErrorDescriptionUtil';
const fumble = require('fumble');

export default function loadSlideEdit(context, payload, done) {
    if(!(/^[0-9a-zA-Z-]+$/.test(payload.params.sid) || payload.params.sid === undefined)) {
        let error = fumble.http.badRequest();
        context.dispatch('SLIDE_ERROR', ErrorsList.SLIDE_ID_TYPE_ERROR);
        throw error;
    }

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
