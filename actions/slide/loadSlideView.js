import {shortTitle} from '../../configs/general';
import { slideIdTypeError, serviceUnavailable } from '../loadErrors';

export default function loadSlideView(context, payload, done) {
    console.log('load slide view called');
    if (!(/^[0-9a-zA-Z-]+$/.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload).catch((err) => {done(err);});
        return;
    }

    context.service.read('slide.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.executeAction(serviceUnavailable, payload).catch((error) => {done(error);});
            return;
        } else {
            context.dispatch('LOAD_SLIDE_CONTENT_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Slide View | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
